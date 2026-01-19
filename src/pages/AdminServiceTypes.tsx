import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Pencil, Trash2, DollarSign, Clock, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ServiceTypeForm } from "@/components/admin/ServiceTypeForm";
import { useAdminServiceTypes } from "@/hooks/useAdminServiceTypes";
import type { Tables } from "@/integrations/supabase/types";

type ServiceType = Tables<"service_types">;

export default function AdminServiceTypes() {
  const { serviceTypes, loading, createServiceType, updateServiceType, deleteServiceType, toggleActive } = useAdminServiceTypes();
  const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingServiceType(null);
    setIsFormOpen(true);
  };

  const handleEdit = (serviceType: ServiceType) => {
    setEditingServiceType(serviceType);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editingServiceType) {
      return updateServiceType(editingServiceType.id, data);
    }
    return createServiceType(data);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteServiceType(deleteId);
      setDeleteId(null);
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "bg-primary/10 text-primary";
      case "class":
        return "bg-secondary/10 text-secondary-foreground";
      case "camp":
        return "bg-accent/10 text-accent-foreground";
      case "assessment":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin/schedule">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Service Types
              </h1>
              <p className="text-muted-foreground">
                Manage your service offerings and pricing
              </p>
            </div>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service Type
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{serviceTypes.length}</p>
                    <p className="text-muted-foreground text-sm">Total Services</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Clock className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {serviceTypes.filter((s) => s.is_active).length}
                    </p>
                    <p className="text-muted-foreground text-sm">Active Services</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Users className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {serviceTypes.filter((s) => s.max_participants > 1).length}
                    </p>
                    <p className="text-muted-foreground text-sm">Group Services</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Service Types List */}
        <Card>
          <CardHeader>
            <CardTitle>All Service Types</CardTitle>
          </CardHeader>
          <CardContent>
            {serviceTypes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No service types found</p>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first service type
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {serviceTypes.map((serviceType, index) => (
                  <motion.div
                    key={serviceType.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={serviceType.is_active}
                        onCheckedChange={(checked) => toggleActive(serviceType.id, checked)}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{serviceType.name}</h3>
                          <Badge className={getServiceTypeColor(serviceType.service_type)}>
                            {serviceType.service_type}
                          </Badge>
                          {!serviceType.is_active && (
                            <Badge variant="outline" className="text-muted-foreground">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {serviceType.description || "No description"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {serviceType.duration_minutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Max {serviceType.max_participants}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">${Number(serviceType.base_price).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          Member: ${Number(serviceType.member_price).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(serviceType)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(serviceType.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingServiceType ? "Edit Service Type" : "New Service Type"}
            </DialogTitle>
          </DialogHeader>
          <ServiceTypeForm
            serviceType={editingServiceType}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service type? This action cannot be undone.
              Existing bookings using this service type will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
