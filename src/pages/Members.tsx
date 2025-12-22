import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  age?: string;
  gender?: string;
  province?: string;
  constituency?: string;
  ward?: string;
  isRegisteredVoter?: string;
  voterCardNumber?: string;
  created_at: number;
}

const Members = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/members");
      if (!res.ok) throw new Error("Failed to fetch members");
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching members");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember({ ...member });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/members/${editingMember.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingMember),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update member");
      }

      setIsEditDialogOpen(false);
      setEditingMember(null);
      await fetchMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating member");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/members/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete member");
      }

      await fetchMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting member");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAdminClick={() => {}} />

      <main className="container max-w-6xl py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Registered Members</h1>
          <Button
            onClick={() => {
              logout();
              navigate("/");
            }}
            variant="destructive"
          >
            Logout
          </Button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading members...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-6">
            Error: {error}
          </div>
        )}

        {!loading && !error && members.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No members registered yet.</p>
          </Card>
        )}

        {!loading && !error && members.length > 0 && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>Constituency</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.id}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell className="text-sm">{member.email}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>{member.age || "—"}</TableCell>
                      <TableCell className="capitalize">
                        {member.gender || "—"}
                      </TableCell>
                      <TableCell>{member.province || "—"}</TableCell>
                      <TableCell>{member.constituency || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(member.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(member)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(member.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="bg-muted p-4 text-sm text-muted-foreground">
              Total Members: {members.length}
            </div>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Member</DialogTitle>
            </DialogHeader>
            {editingMember && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editingMember.name}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingMember.email}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editingMember.phone}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={editingMember.age || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        age: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={editingMember.gender || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        gender: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    value={editingMember.province || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        province: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Members;
