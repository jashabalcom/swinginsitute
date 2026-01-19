import { useState } from "react";
import { Plus, X, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PollData {
  question: string;
  options: string[];
  allowMultiple: boolean;
  endsAt: Date | null;
}

interface PollCreatorProps {
  onPollChange: (poll: PollData | null) => void;
  onRemove: () => void;
}

export function PollCreator({ onPollChange, onRemove }: PollCreatorProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [duration, setDuration] = useState<string>("1d"); // 1h, 6h, 1d, 3d, 1w

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      updatePoll(question, newOptions, allowMultiple, duration);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    updatePoll(question, newOptions, allowMultiple, duration);
  };

  const updatePoll = (q: string, opts: string[], multi: boolean, dur: string) => {
    const validOptions = opts.filter(o => o.trim());
    if (!q.trim() || validOptions.length < 2) {
      onPollChange(null);
      return;
    }

    const endsAt = getEndDate(dur);
    onPollChange({
      question: q,
      options: validOptions,
      allowMultiple: multi,
      endsAt,
    });
  };

  const getEndDate = (dur: string): Date => {
    const now = new Date();
    switch (dur) {
      case "1h":
        return new Date(now.getTime() + 60 * 60 * 1000);
      case "6h":
        return new Date(now.getTime() + 6 * 60 * 60 * 1000);
      case "1d":
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case "3d":
        return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      case "1w":
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  };

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Create Poll</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemove}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Question */}
      <Input
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
          updatePoll(e.target.value, options, allowMultiple, duration);
        }}
        className="font-medium"
      />

      {/* Options */}
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
            />
            {options.length > 2 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => removeOption(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {options.length < 6 && (
          <Button
            variant="outline"
            size="sm"
            onClick={addOption}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Option
          </Button>
        )}
      </div>

      {/* Settings */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <Switch
            id="allowMultiple"
            checked={allowMultiple}
            onCheckedChange={(checked) => {
              setAllowMultiple(checked);
              updatePoll(question, options, checked, duration);
            }}
          />
          <Label htmlFor="allowMultiple" className="text-sm">
            Multiple answers
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">Duration:</Label>
          <select
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
              updatePoll(question, options, allowMultiple, e.target.value);
            }}
            className="bg-background border border-input rounded px-2 py-1 text-sm"
          >
            <option value="1h">1 hour</option>
            <option value="6h">6 hours</option>
            <option value="1d">1 day</option>
            <option value="3d">3 days</option>
            <option value="1w">1 week</option>
          </select>
        </div>
      </div>
    </div>
  );
}
