"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
  Video,
  Phone,
  MessageSquare,
  MapPin,
  CalendarIcon,
  Clock,
  User,
  Stethoscope,
  FileText,
  Star,
  Zap,
  Monitor,
  Users,
  Plus,
} from "lucide-react"
import { format } from "date-fns"

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  experience: string
  availability: string[]
  image?: string
  consultationFee: number
  languages: string[]
}

interface Appointment {
  id: string
  doctorId: string
  doctorName: string
  specialty: string
  date: string
  time: string
  type: "video" | "audio" | "chat" | "physical"
  status: "upcoming" | "completed" | "cancelled"
  notes?: string
  prescription?: string
}

interface DoctorConsultationContentProps {
  user: { name: string; email: string }
}

const DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    rating: 4.8,
    experience: "12 years",
    availability: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    consultationFee: 150,
    languages: ["English", "Spanish"],
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Cardiologist",
    rating: 4.9,
    experience: "15 years",
    availability: ["10:00", "11:00", "14:30", "15:30", "16:30"],
    consultationFee: 250,
    languages: ["English", "Mandarin"],
  },
  {
    id: "3",
    name: "Dr. Priya Sharma",
    specialty: "Dermatologist",
    rating: 4.7,
    experience: "10 years",
    availability: ["09:30", "10:30", "13:00", "14:00", "15:00"],
    consultationFee: 200,
    languages: ["English", "Hindi"],
  },
  {
    id: "4",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    rating: 4.9,
    experience: "8 years",
    availability: ["08:00", "09:00", "10:00", "13:30", "14:30"],
    consultationFee: 180,
    languages: ["English", "Spanish"],
  },
]

const UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    doctorId: "1",
    doctorName: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    date: "2024-06-01",
    time: "10:00 AM",
    type: "video",
    status: "upcoming",
    notes: "Annual checkup and health assessment",
  },
  {
    id: "2",
    doctorId: "3",
    doctorName: "Dr. Priya Sharma",
    specialty: "Dermatologist",
    date: "2024-06-05",
    time: "02:00 PM",
    type: "physical",
    status: "upcoming",
    notes: "Skin condition follow-up",
  },
]

const CONSULTATION_HISTORY: Appointment[] = [
  {
    id: "3",
    doctorId: "2",
    doctorName: "Dr. Michael Chen",
    specialty: "Cardiologist",
    date: "2024-05-20",
    time: "02:30 PM",
    type: "video",
    status: "completed",
    notes: "Heart health consultation",
    prescription: "Continue current medication, follow-up in 3 months",
  },
  {
    id: "4",
    doctorId: "1",
    doctorName: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    date: "2024-05-10",
    time: "11:00 AM",
    type: "audio",
    status: "completed",
    notes: "Cold and flu symptoms",
    prescription: "Rest, fluids, and over-the-counter medication",
  },
]

export function DoctorConsultationContent({ user }: DoctorConsultationContentProps) {
  const [showBooking, setShowBooking] = useState(false)
  const [selectedConsultationType, setSelectedConsultationType] = useState<string>("")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [consultationNotes, setConsultationNotes] = useState("")
  const [searchSpecialty, setSearchSpecialty] = useState("")
  const [appointments, setAppointments] = useState([...UPCOMING_APPOINTMENTS])
  const [consultationHistory, setConsultationHistory] = useState([...CONSULTATION_HISTORY])

  const consultationTypes = [
    {
      id: "video",
      title: "Video Consultation",
      icon: Video,
      description: "Face-to-face consultation via secure video call",
      duration: "30-45 minutes",
      color: "from-blue-600/30 to-blue-800/30 border-blue-500/30",
    },
    {
      id: "audio",
      title: "Audio Call",
      icon: Phone,
      description: "Voice-only consultation for quick medical advice",
      duration: "15-30 minutes",
      color: "from-green-600/30 to-green-800/30 border-green-500/30",
    },
    {
      id: "chat",
      title: "Chat Session",
      icon: MessageSquare,
      description: "Text-based consultation for non-urgent queries",
      duration: "24-48 hours response",
      color: "from-purple-600/30 to-purple-800/30 border-purple-500/30",
    },
    {
      id: "physical",
      title: "Physical Visit",
      icon: MapPin,
      description: "In-person consultation at clinic or hospital",
      duration: "45-60 minutes",
      color: "from-cyan-600/30 to-cyan-800/30 border-cyan-500/30",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-600/40 text-blue-400 border-blue-500/30"
      case "completed":
        return "bg-green-600/40 text-green-400 border-green-500/30"
      case "cancelled":
        return "bg-red-600/40 text-red-400 border-red-500/30"
      default:
        return "bg-slate-600/20 text-slate-300 border-slate-500/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "audio":
        return <Phone className="w-4 h-4" />
      case "chat":
        return <MessageSquare className="w-4 h-4" />
      case "physical":
        return <MapPin className="w-4 h-4" />
      default:
        return <Stethoscope className="w-4 h-4" />
    }
  }

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !selectedConsultationType) {
      return
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      type: selectedConsultationType as "video" | "audio" | "chat" | "physical",
      status: "upcoming",
      notes: consultationNotes,
    }

    setAppointments((prev) => [...prev, newAppointment])

    // Reset form
    setShowBooking(false)
    setSelectedDoctor(null)
    setSelectedDate(undefined)
    setSelectedTime("")
    setConsultationNotes("")
    setSelectedConsultationType("")

    // Show success message
    alert(
      `Appointment booked successfully with ${selectedDoctor.name} on ${format(selectedDate, "PPP")} at ${selectedTime}`,
    )
  }

  const handleConnect = (appointment: Appointment) => {
    if (appointment.type === "video") {
      // In a real app, this would open video call interface
      alert(`Connecting to video consultation with ${appointment.doctorName}...`)
      // You could integrate with services like Zoom, WebRTC, etc.
    } else if (appointment.type === "audio") {
      alert(`Initiating audio call with ${appointment.doctorName}...`)
    } else if (appointment.type === "chat") {
      // Redirect to chat interface
      window.location.href = "/health-assistant"
    }
  }

  const handleViewReport = (appointment: Appointment) => {
    // In a real app, this would open the medical report
    const reportData = {
      patientName: user.name,
      doctorName: appointment.doctorName,
      date: appointment.date,
      diagnosis: "General health assessment completed",
      prescription: appointment.prescription || "No prescription required",
      followUp: "Schedule follow-up in 3 months",
    }

    alert(
      `Medical Report for ${appointment.doctorName} consultation:\n\nDiagnosis: ${reportData.diagnosis}\nPrescription: ${reportData.prescription}\nFollow-up: ${reportData.followUp}`,
    )
  }

  const filteredDoctors = DOCTORS.filter((doctor) =>
    searchSpecialty ? doctor.specialty.toLowerCase().includes(searchSpecialty.toLowerCase()) : true,
  )

  return (
    <main className="flex-1 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">DOCTOR CONSULTATION</h1>
        <p className="text-slate-300 text-lg">Advanced Medical Interface & Professional Consultation Portal</p>
        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-4"></div>
      </div>

      {/* Schedule New Appointment */}
      <Card className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border-blue-500/30 mb-8">
        <CardHeader>
          <CardTitle className="text-white font-semibold text-xl">Schedule New Appointment</CardTitle>
          <p className="text-slate-200">Book your consultation with medical professionals</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {consultationTypes.map((type) => (
              <Card
                key={type.id}
                className={`bg-gradient-to-br ${type.color} cursor-pointer hover:scale-105 transition-transform duration-200`}
                onClick={() => {
                  setSelectedConsultationType(type.id)
                  setShowBooking(true)
                }}
              >
                <CardContent className="p-6 text-center">
                  <type.icon className="w-8 h-8 mx-auto mb-3 text-white" />
                  <h3 className="text-white font-semibold mb-2">{type.title}</h3>
                  <p className="text-slate-200 text-sm mb-2">{type.description}</p>
                  <p className="text-slate-300 text-xs">{type.duration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="bg-gradient-to-br from-slate-700/20 to-slate-800/20 border-slate-600/30 mb-8">
        <CardHeader>
          <CardTitle className="text-white font-semibold text-xl">Upcoming Appointments</CardTitle>
          <p className="text-slate-200">Your scheduled medical consultations and health appointments</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border-blue-500/30"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600/30 flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{appointment.doctorName}</h3>
                        <p className="text-slate-200">{appointment.specialty}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-300">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status.toUpperCase()}</Badge>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(appointment.type)}
                        <span className="text-slate-200 text-sm capitalize">{appointment.type}</span>
                      </div>
                      <Button
                        onClick={() => handleConnect(appointment)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consultation History */}
      <Card className="bg-gradient-to-br from-slate-700/20 to-slate-800/20 border-slate-600/30 mb-8">
        <CardHeader>
          <CardTitle className="text-white font-semibold text-xl">Consultation History</CardTitle>
          <p className="text-slate-200">Previous medical consultations and session records</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consultationHistory.map((appointment) => (
              <Card
                key={appointment.id}
                className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 border-purple-500/30"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{appointment.doctorName}</h3>
                        <p className="text-slate-200">{appointment.specialty}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-300">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status.toUpperCase()}</Badge>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(appointment.type)}
                        <span className="text-slate-200 text-sm capitalize">{appointment.type}</span>
                      </div>
                      <Button
                        onClick={() => handleViewReport(appointment)}
                        variant="outline"
                        className="border-purple-500 text-purple-400 hover:bg-purple-600/20"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Monitor className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <h3 className="text-white font-semibold text-lg mb-2">HD Video Consultations</h3>
            <p className="text-slate-200 text-sm">
              High-definition secure video consultations with advanced encryption
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h3 className="text-white font-semibold text-lg mb-2">Expert Medical Network</h3>
            <p className="text-slate-200 text-sm">
              Access to specialized medical professionals and comprehensive healthcare
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-600/30 to-cyan-800/30 border-cyan-500/30">
          <CardContent className="p-6 text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
            <h3 className="text-white font-semibold text-lg mb-2">Instant Scheduling</h3>
            <p className="text-slate-200 text-sm">
              Real-time consultation scheduling with flexible appointment options
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white font-semibold text-xl">Book Appointment</CardTitle>
                <p className="text-slate-300">
                  Schedule your {consultationTypes.find((t) => t.id === selectedConsultationType)?.title}
                </p>
              </div>
              <Button onClick={() => setShowBooking(false)} variant="ghost" className="text-slate-300 hover:text-white">
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Doctor Selection */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Select Doctor</h3>
                  <div className="mb-4">
                    <Input
                      placeholder="Search by specialty..."
                      value={searchSpecialty}
                      onChange={(e) => setSearchSpecialty(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {filteredDoctors.map((doctor) => (
                      <Card
                        key={doctor.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedDoctor?.id === doctor.id
                            ? "bg-blue-600/30 border-blue-500"
                            : "bg-slate-800/70 border-slate-600 hover:bg-slate-700/50"
                        }`}
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold">{doctor.name}</h4>
                              <p className="text-slate-300 text-sm">{doctor.specialty}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-yellow-400 text-xs">{doctor.rating}</span>
                                </div>
                                <span className="text-slate-400 text-xs">•</span>
                                <span className="text-slate-300 text-xs">{doctor.experience}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-semibold">${doctor.consultationFee}</p>
                              <p className="text-slate-300 text-xs">consultation</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Date & Time Selection */}
                <div>
                  <h3 className="text-white font-semibold mb-4">Select Date & Time</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-200 text-sm mb-2 block">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left bg-slate-800 border-slate-600 text-white"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {selectedDoctor && (
                      <div>
                        <label className="text-slate-200 text-sm mb-2 block">Available Times</label>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedDoctor.availability.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTime(time)}
                              className={
                                selectedTime === time
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
                              }
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-slate-200 text-sm mb-2 block">Consultation Notes (Optional)</label>
                      <Textarea
                        placeholder="Describe your symptoms or reason for consultation..."
                        value={consultationNotes}
                        onChange={(e) => setConsultationNotes(e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                        rows={4}
                      />
                    </div>

                    <Button
                      onClick={handleBookAppointment}
                      disabled={!selectedDoctor || !selectedDate || !selectedTime}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
