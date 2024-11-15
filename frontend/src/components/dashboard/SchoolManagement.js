import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useToast } from "@/globals/ui/use-toast"
import { Button } from "@/globals/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/globals/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/globals/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/globals/ui/alert-dialog"
import { Input } from "@/globals/ui/input"
import { Label } from "@/globals/ui/label"

const SchoolManagement = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentSchool, setCurrentSchool] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await axios.get('https://school-locator.onrender.com/api/schools');
      setSchools(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch schools');
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to fetch schools",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (school) => {
    setCurrentSchool(school);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://school-locator.onrender.com/api/schools/${id}`);
      setSchools(schools.filter(school => school.id !== id));
      toast({
        title: "Success",
        description: "School deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete school",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const schoolData = Object.fromEntries(formData.entries());

    try {
      if (currentSchool) {
        await axios.put(`https://school-locator.onrender.com/api/schools/${currentSchool.id}`, schoolData);
        setSchools(schools.map(school => school.id === currentSchool.id ? { ...school, ...schoolData } : school));
        toast({
          title: "Success",
          description: "School updated successfully",
        });
      } else {
        const response = await axios.post('https://school-locator.onrender.com/api/schools', schoolData);
        setSchools([...schools, response.data]);
        toast({
          title: "Success",
          description: "School added successfully",
        });
      }
      setIsEditModalOpen(false);
      setCurrentSchool(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save school",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">School Management</h1>
      <Button onClick={() => setIsEditModalOpen(true)} className="mb-4">Add New School</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Admission Fee</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schools.map((school) => (
            <TableRow key={school.id}>
              <TableCell>{school.name}</TableCell>
              <TableCell>{school.type}</TableCell>
              <TableCell>{school.admissionFee}</TableCell>
              <TableCell>{school.location}</TableCell>
              <TableCell>
                <Button variant="outline" size="icon" onClick={() => handleEdit(school)} className="mr-2">
                  <FaEdit />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <FaTrash />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the school.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(school.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentSchool ? 'Edit School' : 'Add New School'}</DialogTitle>
            <DialogDescription>
              {currentSchool ? 'Edit the school details below.' : 'Enter the details for the new school.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={currentSchool?.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Input
                  id="type"
                  name="type"
                  defaultValue={currentSchool?.type}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="admissionFee" className="text-right">
                  Admission Fee
                </Label>
                <Input
                  id="admissionFee"
                  name="admissionFee"
                  type="number"
                  defaultValue={currentSchool?.admissionFee}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={currentSchool?.location}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={currentSchool?.description}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolManagement;