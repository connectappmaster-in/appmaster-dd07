import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Shield, ShieldAlert, User, Edit, Key, Trash2, UserCheck, MoreHorizontal, Download, Upload, Plus, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
export const UsersManagement = () => {
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: ""
  });
  const [addUserForm, setAddUserForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "user"
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {
    data: users,
    isLoading
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.functions.invoke('get-all-users');
      if (error) throw error;
      return data;
    }
  });
  const {
    data: currentUser
  } = useQuery({
    queryKey: ['current-user-role'],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return null;

      const {
        data: roleData
      } = await (supabase as any).from('user_roles').select('role').eq('user_id', user.id).single();
      return {
        ...user,
        role: roleData && roleData.role ? roleData.role : 'user'
      } as any;
    }
  });
  const updateRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      newRole
    }: {
      userId: string;
      newRole: string;
    }) => {
      const {
        data,
        error
      } = await supabase.functions.invoke('manage-user-role', {
        body: {
          targetUserId: userId,
          newRole
        }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User role updated successfully"
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-users']
      });
      setSelectedUsers([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive"
      });
    }
  });
  const updateUserMutation = useMutation({
    mutationFn: async ({
      userId,
      updates
    }: {
      userId: string;
      updates: any;
    }) => {
      // @ts-ignore - types will be regenerated
      const {
        error
      } = await supabase
      // @ts-ignore
      .from('profiles')
      // @ts-ignore
      .update(updates).eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-users']
      });
      setEditDialogOpen(false);
      setSelectedUsers([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive"
      });
    }
  });
  const resetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password reset email sent"
      });
      setSelectedUsers([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive"
      });
    }
  });
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const {
        error
      } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-users']
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      setSelectedUsers([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    }
  });
  const addUserMutation = useMutation({
    mutationFn: async (userData: typeof addUserForm) => {
      const {
        data,
        error
      } = await supabase.functions.invoke('create-user', {
        body: {
          email: userData.email,
          password: userData.password,
          full_name: userData.full_name,
          role: userData.role
        }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User created successfully"
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-users']
      });
      setAddUserDialogOpen(false);
      setAddUserForm({
        email: "",
        password: "",
        full_name: "",
        role: "user"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive"
      });
    }
  });
  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({
      userId,
      newRole
    });
  };
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };
  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((u: any) => u.id));
    }
  };
  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditForm({
      full_name: user.full_name || "",
      email: user.email || ""
    });
    setEditDialogOpen(true);
  };
  const handleSaveEdit = () => {
    if (editingUser) {
      updateUserMutation.mutate({
        userId: editingUser.id,
        updates: editForm
      });
    }
  };
  const handleResetPassword = (email: string) => {
    resetPasswordMutation.mutate(email);
  };
  const handleBulkRoleChange = (newRole: string) => {
    selectedUsers.forEach(userId => {
      updateRoleMutation.mutate({
        userId,
        newRole
      });
    });
  };
  const handleDeleteUser = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };
  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  };
  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
      selectedUsers.forEach(userId => {
        deleteUserMutation.mutate(userId);
      });
    }
  };
  const handleExport = () => {
    if (!users) return;
    const csv = [['Name', 'Email', 'Role', 'Status', 'Last Login', 'Created'].join(','), ...users.map((u: any) => [u.full_name || '', u.email || '', u.role || 'user', u.status || 'active', u.last_login ? new Date(u.last_login).toISOString() : '', new Date(u.created_at).toISOString()].join(','))].join('\n');
    const blob = new Blob([csv], {
      type: 'text/csv'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
      title: "Success",
      description: "Users exported successfully"
    });
  };
  const handleImport = () => {
    toast({
      title: "Coming Soon",
      description: "Import functionality will be available soon"
    });
  };
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <ShieldAlert className="h-4 w-4 mr-1 text-destructive" />;
      case 'admin':
        return <Shield className="h-4 w-4 mr-1 text-primary" />;
      default:
        return <User className="h-4 w-4 mr-1 text-muted-foreground" />;
    }
  };
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'default';
      default:
        return 'secondary';
    }
  };
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter((user: any) => {
      const fullName = (user.full_name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      const role = (user.role || 'user').toLowerCase();
      return fullName.includes(query) || email.includes(query) || role.includes(query);
    });
  }, [users, searchQuery]);

  // Pagination logic
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedUsers([]);
  };
  const handlePageSizeChange = (newSize: string) => {
    setPageSize(parseInt(newSize));
    setCurrentPage(1);
    setSelectedUsers([]);
  };
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSelectedUsers([]);
  };
  if (isLoading) {
    return <Skeleton className="h-96" />;
  }
  return <div className="bg-card rounded-lg border border-border">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-1">
            
            
            {/* Search bar inline */}
            <div className="relative w-[30%] min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="text" placeholder="Search by name, email, or role..." value={searchQuery} onChange={e => handleSearchChange(e.target.value)} className="pl-9 h-9" />
            </div>
          </div>
          
          {isSuperAdmin && <div className="flex items-center gap-2 flex-wrap">
              {selectedUsers.length > 0 && <span className="text-xs text-muted-foreground">
                  {selectedUsers.length} selected
                </span>}
              
              <Button variant="default" size="sm" onClick={() => setAddUserDialogOpen(true)} className="h-8">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add User
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    Bulk Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleImport}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Users
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Users
                  </DropdownMenuItem>
                  
                  {selectedUsers.length > 0 && <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Selected Users</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleBulkRoleChange('user')}>
                        <User className="h-4 w-4 mr-2" />
                        Set as User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkRoleChange('admin')}>
                        <Shield className="h-4 w-4 mr-2" />
                        Set as Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkRoleChange('super_admin')}>
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Set as Super Admin
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleBulkDelete} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Selected
                      </DropdownMenuItem>
                    </>}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {isSuperAdmin && <TableHead className="w-12">
                  <Checkbox checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0} onCheckedChange={handleSelectAll} />
                </TableHead>}
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              {isSuperAdmin && <TableHead className="w-[80px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user: any) => {
            const userRole = user.role || 'user';
            const isCurrentUser = user.id === currentUser?.id;
            return <TableRow key={user.id}>
                  {isSuperAdmin && <TableCell>
                      <Checkbox checked={selectedUsers.includes(user.id)} onCheckedChange={() => handleSelectUser(user.id)} disabled={isCurrentUser} />
                    </TableCell>}
                  <TableCell className="font-medium">
                    {user.full_name}
                    {isCurrentUser && <Badge variant="outline" className="ml-2 text-xs">You</Badge>}
                  </TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell>
                    {isSuperAdmin && !isCurrentUser ? <Select value={userRole} onValueChange={newRole => handleRoleChange(user.id, newRole)} disabled={updateRoleMutation.isPending}>
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue>
                            <div className="flex items-center">
                              {getRoleIcon(userRole)}
                              <span className="capitalize">{userRole.replace('_', ' ')}</span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">
                            <div className="flex items-center">
                              {getRoleIcon('user')}
                              <span>User</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center">
                              {getRoleIcon('admin')}
                              <span>Admin</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="super_admin">
                            <div className="flex items-center">
                              {getRoleIcon('super_admin')}
                              <span>Super Admin</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select> : <Badge variant={getRoleBadgeVariant(userRole)}>
                        <div className="flex items-center">
                          {getRoleIcon(userRole)}
                          <span className="capitalize">{userRole.replace('_', ' ')}</span>
                        </div>
                      </Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {user.last_login ? format(new Date(user.last_login), 'PP') : 'Never'}
                  </TableCell>
                  <TableCell className="text-sm">{format(new Date(user.created_at), 'PP')}</TableCell>
                  {isSuperAdmin && <TableCell>
                      {!isCurrentUser && <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Update Name
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                      toast({
                        title: "Info",
                        description: "Use the role dropdown to update user role"
                      });
                    }}>
                              <Shield className="h-4 w-4 mr-2" />
                              Update Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Status update will be available soon"
                      });
                    }}>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleResetPassword(user.email)}>
                              <Key className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>}
                    </TableCell>}
                </TableRow>;
          })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="px-3 py-2.5 border-t border-border flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rows per page:</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-16 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {startIndex + 1}-{Math.min(endIndex, totalUsers)} of {totalUsers}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="h-7 w-7 p-0">
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 w-7 p-0">
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with email and password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="add_email" className="text-sm">Email</Label>
              <Input id="add_email" type="email" placeholder="user@example.com" value={addUserForm.email} onChange={e => setAddUserForm({
              ...addUserForm,
              email: e.target.value
            })} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add_password" className="text-sm">Password</Label>
              <Input id="add_password" type="password" placeholder="••••••••" value={addUserForm.password} onChange={e => setAddUserForm({
              ...addUserForm,
              password: e.target.value
            })} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add_full_name" className="text-sm">Full Name</Label>
              <Input id="add_full_name" placeholder="John Doe" value={addUserForm.full_name} onChange={e => setAddUserForm({
              ...addUserForm,
              full_name: e.target.value
            })} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add_role" className="text-sm">Role</Label>
              <Select value={addUserForm.role} onValueChange={value => setAddUserForm({
              ...addUserForm,
              role: value
            })}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)} className="h-9">
              Cancel
            </Button>
            <Button onClick={() => addUserMutation.mutate(addUserForm)} disabled={addUserMutation.isPending || !addUserForm.email || !addUserForm.password} className="h-9">
              {addUserMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="full_name" className="text-sm">Full Name</Label>
              <Input id="full_name" value={editForm.full_name} onChange={e => setEditForm({
              ...editForm,
              full_name: e.target.value
            })} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" value={editForm.email} onChange={e => setEditForm({
              ...editForm,
              email: e.target.value
            })} className="h-9" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="h-9">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateUserMutation.isPending} className="h-9">
              {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {userToDelete?.full_name || userToDelete?.email} and all their data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};