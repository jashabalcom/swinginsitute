import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Clock,
  Users,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useAdminPackages, Package as PackageType } from "@/hooks/useAdminPackages";
import { PackageFormDialog } from "@/components/admin/PackageFormDialog";

export default function AdminPackages() {
  const navigate = useNavigate();
  const {
    packages,
    serviceTypes,
    loading,
    isAdmin,
    createPackage,
    updatePackage,
    deletePackage,
    toggleActive,
  } = useAdminPackages();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<PackageType | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading packages...</div>
      </div>
    );
  }

  if (!isAdmin) {
    navigate("/dashboard");
    return null;
  }

  const handleCreateClick = () => {
    setEditingPackage(null);
    setFormDialogOpen(true);
  };

  const handleEditClick = (pkg: PackageType) => {
    setEditingPackage(pkg);
    setFormDialogOpen(true);
  };

  const handleDeleteClick = (pkg: PackageType) => {
    setPackageToDelete(pkg);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (packageToDelete) {
      await deletePackage(packageToDelete.id);
      setDeleteDialogOpen(false);
      setPackageToDelete(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const activePackages = packages.filter((p) => p.is_active);
  const inactivePackages = packages.filter((p) => !p.is_active);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 border-b border-border mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-8 h-8 text-purple-500" />
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Lesson Packages
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  {packages.length} packages ({activePackages.length} active)
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCreateClick}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Package
                </Button>
                <Link to="/admin">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Admin
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Package className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Packages</p>
                  <p className="text-2xl font-bold text-foreground">{packages.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <ToggleRight className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-foreground">{activePackages.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-500/10">
                  <Users className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Sessions</p>
                  <p className="text-2xl font-bold text-foreground">
                    {packages.length > 0
                      ? Math.round(
                          packages.reduce((sum, p) => sum + p.session_count, 0) /
                            packages.length
                        )
                      : 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Packages Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>All Packages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Package</TableHead>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Sessions</TableHead>
                        <TableHead>Base Price</TableHead>
                        <TableHead>Member Price</TableHead>
                        <TableHead>Validity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{pkg.name}</p>
                              {pkg.description && (
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {pkg.description}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {pkg.service_type?.name || (
                              <span className="text-muted-foreground">All</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/10">
                              {pkg.session_count} sessions
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(pkg.base_price)}
                          </TableCell>
                          <TableCell className="font-medium text-green-500">
                            {formatCurrency(pkg.member_price)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {pkg.validity_days} days
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                pkg.is_active
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                              }
                            >
                              {pkg.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleActive(pkg.id, !pkg.is_active)}
                                title={pkg.is_active ? "Deactivate" : "Activate"}
                              >
                                {pkg.is_active ? (
                                  <ToggleRight className="w-4 h-4 text-green-500" />
                                ) : (
                                  <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(pkg)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(pkg)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {packages.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-center text-muted-foreground py-8"
                          >
                            No packages found. Create your first package!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Form Dialog */}
      <PackageFormDialog
        pkg={editingPackage}
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        serviceTypes={serviceTypes}
        onSave={createPackage}
        onUpdate={updatePackage}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{packageToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
