'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, User, Filter } from 'lucide-react';
import scheduleData from '../../data/schedule.json';

interface ClassItem {
  id: string;
  time: string;
  endTime: string;
  location: string;
  title: string;
  semester: string;
  instructor: string;
}

interface DaySchedule {
  day: string;
  label: string;
  color: string;
  classes: ClassItem[];
}

// Generate time slots from 7 AM to 9 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour <= 20; hour++) {
    slots.push(`${hour}:15`);
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

export default function SchedulePage() {
  const router = useRouter();
  const schedule = scheduleData.schedule as DaySchedule[];
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSemesters, setSelectedSemesters] = useState<Set<string>>(new Set(['1ο εξάμηνο', '3ο εξάμηνο', '5ο εξάμηνο']));
  const [showFilters, setShowFilters] = useState(false);

  const semesters = [
    { id: '1ο εξάμηνο', label: '1ο' },
    { id: '3ο εξάμηνο', label: '3ο' },
    { id: '5ο εξάμηνο', label: '5ο' }
  ];

  const toggleSemester = (semester: string) => {
    const newSelected = new Set(selectedSemesters);
    if (newSelected.has(semester)) {
      newSelected.delete(semester);
    } else {
      newSelected.add(semester);
    }
    setSelectedSemesters(newSelected);
  };

  const filteredSchedule = schedule.map(day => ({
    ...day,
    classes: day.classes.filter(c => {
      // Check if class semester contains any selected semester
      return Array.from(selectedSemesters).some(sem => c.semester.includes(sem.replace(' εξάμηνο', '')));
    })
  }));

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Parse time string to get hour and minutes
  const parseTime = (timeStr: string): { hour: number; minute: number } => {
    const match = timeStr.match(/(\d+):(\d+)/);
    return match ? { hour: parseInt(match[1]), minute: parseInt(match[2]) } : { hour: 0, minute: 0 };
  };

  // Check if class matches this time slot
  const matchesTimeSlot = (classTime: string, slotTime: string): boolean => {
    const classT = parseTime(classTime);
    const slotT = parseTime(slotTime);
    return classT.hour === slotT.hour && classT.minute === slotT.minute;
  };

  // Calculate how many time slots a class spans
  const getRowSpan = (startTime: string, endTime: string): number => {
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const startMinutes = start.hour * 60 + start.minute;
    const endMinutes = end.hour * 60 + end.minute;
    const durationMinutes = endMinutes - startMinutes;
    // Each slot is 1 hour, round up
    return Math.ceil(durationMinutes / 60);
  };

  // Check if a class starts at this time slot
  const classStartsAtSlot = (classItem: ClassItem, slotTime: string): boolean => {
    return matchesTimeSlot(classItem.time, slotTime);
  };

  return (
    <div className="min-h-screen pb-8" style={{ background: 'var(--bg-primary)' }}>
      {/* Pill Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 0.6 }}
        whileHover={{ opacity: 1 }}
        className="fixed top-4 left-0 right-0 z-50 flex justify-center"
      >
        <div 
          className="pill-nav px-6 py-3 flex items-center gap-4"
          style={{ opacity: showFilters ? 1 : 'inherit' }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 p-2 rounded-full transition-all"
            style={{
              color: 'var(--text-secondary)',
              background: 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </motion.button>
          
          <h1 className="text-base font-bold" style={{ color: 'var(--accent-coral)' }}>
            Πρόγραμμα
          </h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 p-2 rounded-full transition-all"
            style={{
              color: showFilters ? 'var(--accent-coral)' : 'var(--text-secondary)',
              background: showFilters ? 'rgba(233, 116, 81, 0.15)' : 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <Filter className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </motion.nav>

      {/* Floating Filter Dropdown */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowFilters(false)}
            />
            
            {/* Filter Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ 
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              className="fixed top-[68px] left-0 right-0 z-50 flex justify-center"
            >
              <div 
                className="p-3 rounded-xl"
                style={{
                  background: 'rgba(28, 28, 30, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="flex items-center gap-2">
                  {semesters.map((sem) => (
                    <motion.button
                      key={sem.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSemester(sem.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: selectedSemesters.has(sem.id)
                          ? 'rgba(233, 116, 81, 0.15)'
                          : 'rgba(255, 255, 255, 0.03)',
                        color: selectedSemesters.has(sem.id)
                          ? 'var(--accent-coral)'
                          : 'var(--text-tertiary)',
                        border: selectedSemesters.has(sem.id)
                          ? '1px solid rgba(233, 116, 81, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      {sem.label}
                    </motion.button>
                  ))}
                  
                  <div className="w-px h-4 mx-1" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedSemesters(new Set(['1ο εξάμηνο', '3ο εξάμηνο', '5ο εξάμηνο']));
                      setShowFilters(false);
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: 'var(--text-secondary)',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    Όλα
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Grid View */}
      {!isMobile && (
        <div className="px-4 mt-[68px] overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Header Row */}
            <div className="grid grid-cols-6 gap-1.5 mb-1.5">
              <div className="text-[10px] font-medium px-2 py-1.5" style={{ color: 'var(--text-tertiary)' }}>
                TIME
              </div>
              {filteredSchedule.map((day) => (
                <div
                  key={day.day}
                  className="text-[10px] font-semibold text-center px-2 py-1.5 rounded-md"
                  style={{
                    background: 'rgba(233, 116, 81, 0.1)',
                    color: 'var(--accent-coral)',
                    border: '1px solid rgba(233, 116, 81, 0.2)'
                  }}
                >
                  {day.label}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="relative">
              {TIME_SLOTS.map((time, idx) => (
                <div key={time} className="grid grid-cols-6 gap-1.5 mb-1.5">
                  {/* Time Label */}
                  <div
                    className="text-[10px] px-2 py-1 rounded-md flex items-center justify-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      color: 'var(--text-tertiary)',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    {time}
                  </div>

                  {/* Day Cells */}
                  {filteredSchedule.map((day) => {
                    const classesStartingHere = day.classes.filter(
                      (c) => classStartsAtSlot(c, time)
                    );
                    const rowSpan = classesStartingHere.length > 0 ? Math.max(...classesStartingHere.map(c => getRowSpan(c.time, c.endTime))) : 1;

                    return (
                      <div
                        key={`${day.day}-${time}`}
                        className="rounded-md"
                        style={{
                          background: classesStartingHere.length > 0
                            ? 'rgba(233, 116, 81, 0.08)'
                            : 'rgba(255, 255, 255, 0.02)',
                          border: classesStartingHere.length > 0
                            ? '1px solid rgba(233, 116, 81, 0.2)'
                            : '1px solid rgba(255, 255, 255, 0.06)',
                          minHeight: `${rowSpan * 45}px`
                        }}
                      >
                        {classesStartingHere.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-1.5 h-full flex flex-col gap-1"
                          >
                            {classesStartingHere.map((classItem, idx) => (
                              <div key={classItem.id} className="flex flex-col justify-between relative">
                                <div className="text-[10px] font-semibold leading-tight mb-0.5" style={{ color: 'var(--accent-coral)' }}>
                                  {classItem.title}
                                </div>
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-0.5">
                                    <MapPin className="w-2 h-2 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                                    <span className="text-[9px] truncate" style={{ color: 'var(--text-secondary)' }}>
                                      {classItem.location}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-0.5">
                                    <User className="w-2 h-2 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                                    <span className="text-[9px] truncate" style={{ color: 'var(--text-secondary)' }}>
                                      {classItem.instructor}
                                    </span>
                                  </div>
                                </div>
                                {/* Semester Badge */}
                                <div 
                                  className="absolute bottom-0.5 right-0.5 px-1.5 py-0.5 rounded text-[8px] font-semibold"
                                  style={{
                                    background: 'rgba(233, 116, 81, 0.2)',
                                    color: 'var(--accent-coral)',
                                    border: '1px solid rgba(233, 116, 81, 0.3)'
                                  }}
                                >
                                  {classItem.semester.includes('1ο') ? '1ο' : classItem.semester.includes('3ο') ? '3ο' : '5ο'}
                                </div>
                                {idx < classesStartingHere.length - 1 && (
                                  <div className="my-1 border-t" style={{ borderColor: 'rgba(233, 116, 81, 0.2)' }} />
                                )}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile List View */}
      {isMobile && (
        <div className="px-6 mt-[80px]">
          {filteredSchedule.map((day, dayIdx) => (
            <div key={day.day} className="mb-6">
              <h2
                className="text-sm font-semibold mb-3 px-3 py-2 rounded-lg inline-block"
                style={{
                  background: 'rgba(233, 116, 81, 0.1)',
                  color: 'var(--accent-coral)',
                  border: '1px solid rgba(233, 116, 81, 0.2)'
                }}
              >
                {day.label}
              </h2>
              <div className="space-y-2">
                {day.classes.map((classItem, idx) => (
                  <motion.div
                    key={classItem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: dayIdx * 0.1 + idx * 0.05 }}
                    className="rounded-xl p-3 relative"
                    style={{
                      background: 'rgba(233, 116, 81, 0.08)',
                      border: '1px solid rgba(233, 116, 81, 0.2)'
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold" style={{ color: 'var(--accent-coral)' }}>
                        {classItem.time}
                      </span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {classItem.location}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {classItem.title}
                    </h3>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
                      {classItem.semester}
                    </p>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {classItem.instructor}
                      </span>
                    </div>
                    
                    {/* Semester Badge */}
                    <div 
                      className="absolute bottom-2 right-2 px-2 py-1 rounded-lg text-[10px] font-semibold"
                      style={{
                        background: 'rgba(233, 116, 81, 0.2)',
                        color: 'var(--accent-coral)',
                        border: '1px solid rgba(233, 116, 81, 0.3)'
                      }}
                    >
                      {classItem.semester.includes('1ο') ? '1ο' : classItem.semester.includes('3ο') ? '3ο' : '5ο'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
