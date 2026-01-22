-- Create helper function to notify all admins
CREATE OR REPLACE FUNCTION public.notify_admins(
  notification_type TEXT,
  notification_title TEXT,
  notification_content TEXT,
  notification_link TEXT DEFAULT NULL,
  notification_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_record RECORD;
BEGIN
  FOR admin_record IN 
    SELECT user_id FROM user_roles WHERE role = 'admin'
  LOOP
    INSERT INTO notifications (user_id, type, title, content, link, metadata)
    VALUES (admin_record.user_id, notification_type, notification_title, notification_content, notification_link, notification_metadata);
  END LOOP;
END;
$$;

-- Trigger function: New User Registration
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM notify_admins(
    'new_user',
    'New Member Registered',
    COALESCE(NEW.full_name, 'A new user') || ' just signed up',
    '/admin/members',
    jsonb_build_object('user_id', NEW.user_id::text)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new profile (registration)
CREATE TRIGGER on_new_profile_notify_admins
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_admin_notify();

-- Trigger function: New Community Post
CREATE OR REPLACE FUNCTION public.handle_new_post_admin_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  author_name TEXT;
  channel_name TEXT;
BEGIN
  SELECT full_name INTO author_name FROM profiles WHERE user_id = NEW.user_id;
  SELECT name INTO channel_name FROM channels WHERE id = NEW.channel_id;
  
  PERFORM notify_admins(
    'new_post',
    'New Community Post',
    COALESCE(author_name, 'A member') || ' posted in ' || COALESCE(channel_name, 'the community'),
    '/training-room',
    jsonb_build_object('post_id', NEW.id::text, 'user_id', NEW.user_id::text, 'channel_id', COALESCE(NEW.channel_id::text, ''))
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new post
CREATE TRIGGER on_new_post_notify_admins
AFTER INSERT ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_post_admin_notify();

-- Trigger function: New Comment
CREATE OR REPLACE FUNCTION public.handle_new_comment_admin_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  author_name TEXT;
BEGIN
  SELECT full_name INTO author_name FROM profiles WHERE user_id = NEW.user_id;
  
  PERFORM notify_admins(
    'new_comment',
    'New Comment',
    COALESCE(author_name, 'A member') || ' commented on a post',
    '/training-room',
    jsonb_build_object('comment_id', NEW.id::text, 'post_id', NEW.post_id::text, 'user_id', NEW.user_id::text)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new comment
CREATE TRIGGER on_new_comment_notify_admins
AFTER INSERT ON public.post_comments
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_comment_admin_notify();

-- Trigger function: New Direct Message
CREATE OR REPLACE FUNCTION public.handle_new_dm_admin_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  sender_name TEXT;
BEGIN
  SELECT full_name INTO sender_name FROM profiles WHERE user_id = NEW.sender_id;
  
  PERFORM notify_admins(
    'new_dm',
    'New Direct Message',
    COALESCE(sender_name, 'A member') || ' sent a direct message',
    NULL,
    jsonb_build_object('message_id', NEW.id::text, 'sender_id', NEW.sender_id::text, 'conversation_id', NEW.conversation_id::text)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new DM
CREATE TRIGGER on_new_dm_notify_admins
AFTER INSERT ON public.direct_messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_dm_admin_notify();