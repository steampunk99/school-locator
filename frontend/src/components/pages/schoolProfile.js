import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Mail,Building2,Clock,BookOpen, Phone, Globe, Users, GraduationCap, Award, Calendar } from 'lucide-react';
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import axios from 'axios';
import Header from "./Header"
import svgImage from '../../assets/badge.svg'
import ApplyButton from './ApplyButton';
import AddSchoolImagesForm from '../dashboard/AddSchoolImagesForm';

const SchoolProfile = () => {
  // Get both ID and slug from URL
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        console.log('Fetching school with ID:', id); // Debug log
        const response = await axios.get(`http://localhost:5000/api/schools/${id}`);
        
        if (response.data.success) {
          console.log('School data received:', response.data); // Debug log
          setSchool(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch school data');
        }
      } catch (error) {
        console.error('Error details:', error.response || error); // Detailed error logging
        setError(
          error.response?.data?.message || 
          error.message || 
          'An error occurred while fetching school data'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSchoolData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading school information...</p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              {error || "Failed to load school information"}
            </CardDescription>
          </CardHeader>
          
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background/95">
      <Header/>
      <div className="bg-gradient-to-r from-slate-50 via-slate-100 to-slate-200 dark:from-secondary/60  border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={school.media.logo || "/api/placeholder/80/80"} 
                alt={`${school.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
            <div className='flex'>
              <h1 className="text-2xl text-foreground md:text-3xl font-bold">{school.name} </h1>
             {school.metadata.isVerified && (
                 <img alt='img' src={svgImage} height="auto" width="20px" className="mb-6"/>
                  
                )}
               
             
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{school.type}</Badge>
                <Badge variant="outline">{school.category}</Badge>
                {school.curriculum.map(curr => (
                   <Badge key={curr} variant="outline">{curr}</Badge>
                ))}
               
                
           
               
              </div>
            </div>
            <ApplyButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full space-y-8">
      <div className="border-b">
        <TabsList className="w-full justify-start h-12">
          <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
          <TabsTrigger value="academics" className="text-base">Academics</TabsTrigger>
          <TabsTrigger value="facilities" className="text-base">Facilities</TabsTrigger>
          <TabsTrigger value="admissions" className="text-base">Admissions</TabsTrigger>
          <TabsTrigger value="gallery" className="text-base">Gallery</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Building2 className="w-5 h-5" />
                School Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                      <p className="text-lg font-semibold text-secondary-foreground">{school.stats.studentCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Teaching Staff</p>
                      <p className="text-lg font-semibold text-secondary-foreground">{school.stats.teacherCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Class Size</p>
                      <p className="text-lg font-semibold text-secondary-foreground">{school.stats.classSize} students</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="text-lg font-semibold text-secondary-foreground">{school.location.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">School Hours</p>
                      <p className="text-lg font-semibold text-secondary-foreground">8:00 AM - 4:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact</p>
                      <p className="text-lg font-semibold text-secondary-foreground">{school.contact?.phone || "+256 XXX XXX XXX"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-secondary-foreground'>UCE Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Division 1</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{school.performance.UCE.div1Count}</span>
                    <Badge variant="secondary" className="ml-2">
                      {Math.round((school.performance.UCE.div1Count / school.stats.studentCount) * 100)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Division 2</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{school.performance.UCE.div2Count}</span>
                    <Badge variant="secondary" className="ml-2">
                      {Math.round((school.performance.UCE.div2Count / school.stats.studentCount) * 100)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-secondary-foreground'>UACE Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Above 18 points</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{school.performance.UACE.div1Count}</span>
                    <Badge variant="secondary" className="ml-2">
                      {Math.round((school.performance.UACE.div1Count / school.stats.studentCount) * 100)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Below 10 points</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{school.performance.UACE.div2Count}</span>
                    <Badge variant="secondary" className="ml-2">
                      {Math.round((school.performance.UACE.div2Count / school.stats.studentCount) * 100)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="academics">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex text-foreground items-center gap-2">
                <BookOpen className="w-5 h-5 text-foreground" />
                Academic Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {school.subjects.oLevel && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-secondary-foreground">O-Level Subjects</h4>
                    <div className="flex gap-2">
                      {school.subjects.oLevel.map((subject, index) => (
                        <div key={index} className="flex overflow-hidden items-center p-3 bg-secondary/60 rounded-lg">
                          <Badge variant="secondary" key={subject} className="mr-2" >{subject}</Badge>
                          
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {school.subjects.aLevel && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-secondary-foreground">A-Level Subjects</h4>
                    <div className="flex gap-2">
                      {school.subjects.aLevel.map((subject, index) => (
                        <div key={index} className="flex items-center p-3 bg-secondary/60 rounded-lg">
                          <Badge variant="secondary" key={subject} className="mr-2" >{subject}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="facilities">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Building2 className="w-5 h-5" />
              Campus Facilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {school.facilities.map((facility, index) => (
                <div key={index} className="p-6 bg-secondary/60 rounded-lg space-y-2">
                  <h4 className="font-semibold text-foreground">{facility.name}</h4>
                  <p className="text-sm text-muted-foreground">{facility.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="admissions">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className='text-foreground'>Available Spots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-secondary/60 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">Day Students</p>
                  <p className="text-3xl font-bold text-muted-foreground">{school.admissions.availableSpots.dayStudents}</p>
                </div>
                <div className="p-6 bg-secondary/60 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">Boarding Students</p>
                  <p className="text-3xl font-bold text-muted-foreground">{school.admissions.availableSpots.boardingStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className='text-foreground'>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {school.admissions.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full" />
                      <span className="text-secondary-foreground">{req.name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='text-foreground'>Fees Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-secondary/60 rounded-lg">
                    <span className="text-sm font-medium text-secondary-foreground">Admission Fee</span>
                    <span className="font-semibold text-secondary-foreground font-mono">UGX {school.fees.admissionFee.toLocaleString()}</span>
                  </div>
                  {school.fees.tuitionFee.boardingStudent && (
                    <div className="flex justify-between items-center p-3 bg-secondary/60 rounded-lg">
                      <span className="text-sm font-medium text-secondary-foreground">Boarding Fee</span>
                      <span className="font-semibold font-mono text-secondary-foreground">UGX {school.fees.tuitionFee.boardingStudent.toLocaleString()}</span>
                    </div>
                  )}
                  {school.fees.tuitionFee.dayStudent && (
                    <div className="flex justify-between items-center p-3 bg-secondary/60 rounded-lg">
                      <span className="text-sm text-secondary-foreground font-medium">Day Fee</span>
                      <span className="font-semibold text-secondary-foreground font-mono">UGX {school.fees.tuitionFee.dayStudent.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="gallery">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Image Display */}
              <div className="md:col-span-2">
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-secondary">
                  <img 
                    src={selectedImage || (school.media.gallery?.[0]?.url || '/placeholder-image.jpg')}
                    alt="Selected gallery image"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

   

              {/* Thumbnail Grid */}
              <div className="space-y-4">
                <ScrollArea className="h-[60vh]">
                  <div className="grid grid-cols-2 gap-4 pr-4">
                    {school.media.gallery?.map((image, index) => (
                      <div
                        key={index}
                        className={cn(
                          "aspect-square rounded-lg overflow-hidden cursor-pointer border-2",
                          selectedImage === image.url ? "border-primary" : "border-transparent"
                        )}
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <img
                          src={image.url}
                          alt={image.caption || `Gallery image ${index + 1}`}
                          className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="bg-secondary/60 ">
              <CardHeader>
                <CardTitle className='text-foreground'>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a href={`mailto:${school.contact.email}`} className="text-blue-600 hover:underline">
                    {school.contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <a href={`tel:${school.contact.phone}`} className="text-blue-600 hover:underline">
                    {school.contact.phone}
                  </a>
                </div>
                {school.contact.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a href={school.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-secondary/60 ">
              <CardHeader>
                <CardTitle className="text-foreground">Key Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className='text-secondary-foreground'>Application Deadline: {new Date(school.admissions.applicationDeadline).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* <Button className="w-full md:hidden">Apply Now</Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolProfile;