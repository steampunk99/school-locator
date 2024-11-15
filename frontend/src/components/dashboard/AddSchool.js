"use client"

import { useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Calendar } from "../ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { cn } from "../../lib/utils"
import { CalendarIcon } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  type: z.string().min(2, {
    message: "Type must be at least 2 characters.",
  }),
  admissionFee: z.number().min(0, {
    message: "Admission fee must be a positive number.",
  }),
  description: z.string().optional(),
  applicationDeadline: z.date({
    required_error: "Application deadline is required.",
  }),
  availableSpots: z.number().min(0, {
    message: "Available spots must be a positive number.",
  }),
  requirements: z.string().optional(),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }),
  year: z.string().regex(/^\d{4}$/, {
    message: "Year must be a 4-digit number.",
  }),
})

export default function AddSchoolModal({ isOpen, onClose, onSchoolAdded }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [step, setStep] = useState(1)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      type: "",
      admissionFee: 0,
      description: "",
      applicationDeadline: new Date(),
      availableSpots: 0,
      requirements: "",
      website: "",
      year: "",
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setMessage("")

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === "applicationDeadline") {
        formData.append(key, value.toISOString())
      } else if (key === "requirements") {
        formData.append(key, value.split(",").map((req) => req.trim()))
      } else {
        formData.append(key, value)
      }
    })

    if (form.watch("logo")) {
      formData.append("logo", form.watch("logo"))
    }

    try {
      await axios.post("http://localhost:5000/api/schools/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setMessage("School added successfully!")
      form.reset()
      onSchoolAdded()
      onClose()
    } catch (error) {
      console.error("Error adding school:", error)
      setMessage("Error adding school. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter school name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter school type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Established</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter year established" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      case 2:
        return (
          <>
            <FormField
              control={form.control}
              name="admissionFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admission Fee</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter admission fee"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableSpots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Spots</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter available spots"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applicationDeadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Application Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value && field.value instanceof Date && !isNaN(field.value.getTime())
                            ? format(field.value, "PPP")
                            : <span>Pick a date</span>
                          }
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date > new Date("2100-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      case 3:
        return (
          <>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter school description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter requirements"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="Enter school website"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Logo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
      default:
        return null
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New School</DialogTitle>
          <DialogDescription>
            Fill out the form to add a new school. This is step {step} of 3.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {renderStep()}
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
                disabled={step === 1}
              >
                Previous
              </Button>
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep((prev) => Math.min(prev + 1, 3))}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Add School"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}