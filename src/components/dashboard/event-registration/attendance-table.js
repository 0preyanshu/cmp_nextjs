"use client";

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import { toast } from '@/components/core/toaster';
import axios from 'axios';

const HOST_API = "https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg";

export const AttendanceTable = React.forwardRef(({ eventData, attendance, setParentIsSubmitting, currentPage = 1, currentLimit = 10 }, ref) => {
  const [initialAttendance, setInitialAttendance] = React.useState(attendance);
  const [topLevelCheckboxes, setTopLevelCheckboxes] = React.useState([]);

  const startDate = new Date(eventData.eventStartDate);
  const endDate = new Date(eventData.eventEndDate);
  const days = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(`Day ${days.length + 1}`);
  }

  // Define the Zod schema
  const attendanceSchema = z.object({
    attendanceData: z.array(z.object({
      eventID: z.string(),
      participantID: z.string(),
      attendance: z.array(z.string())
    }))
  });

  const { control, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      attendanceData: attendance || eventData.participants.map(participant => ({
        eventID: eventData.id || "",
        participantID: participant.participantID,
        attendance: []
      }))
    }
  });



  const rows = React.useMemo(() => {
    return eventData.participants.map((participant, index) => {
      const attendanceData = new Set(watch(`attendanceData[${index}].attendance`)); // Converting to set for optimized lookup in checkboxes onChange
      const attendanceArray = days.map((day, dayIndex) => attendanceData.has((dayIndex + 1).toString()));
      return {
        serialNo: index + 1,
        name: `${participant.firstName} ${participant.lastName}`,
        email: participant.email,
        phone: participant.phone,
        participantID: participant.participantID,
        attendance: attendanceArray
      };
    });
  }, [eventData.participants, watch]);

  const paginatedRows = React.useMemo(() => {
    const start = (currentPage - 1) * currentLimit;
    const end = start + currentLimit;
    return rows.slice(start, end);
  }, [rows, currentPage, currentLimit]);

    React.useEffect(() => {
    const allTopLevelChecked = days.map((_, dayIndex) =>
      eventData.participants.every((_, participantIndex) =>
        watch(`attendanceData[${participantIndex}].attendance`).includes((dayIndex + 1).toString())
      )
    );
    
    setTopLevelCheckboxes(allTopLevelChecked);
  }, [watch, eventData.participants]);

  const onSubmit = async data => {
    setParentIsSubmitting(true);
    let requestsMade = 0;

    try {
      const promises = data.attendanceData.map(async participantData => {
        const initialAttendanceEntry = initialAttendance.find(item => item.participantID === participantData.participantID)?.attendance || [];
        if (JSON.stringify(initialAttendanceEntry) !== JSON.stringify(participantData.attendance)) {
          requestsMade++;
          try {
            const response = await axios.post(`${HOST_API}/event/attendance/${participantData.eventID}/${participantData.participantID}`, {
              attendance: participantData.attendance
            });

            console.log("Response for", participantData.participantID, response.data?.data);
            if (!response.data.data) {
              const errorMessage = response.data.error || 'Unknown error occurred';
              toast.error(`Participant ${participantData.participantID} update failed: ${errorMessage}`);
              console.error(`Submission error for ${participantData.participantID}: ${errorMessage}`);
              return null;
            }

            return { ...participantData, attendance: participantData.attendance };
          } catch (error) {
            toast.error(`Participant ${participantData.participantID} update failed`);
            console.error(`Submission error for ${participantData.participantID}:`, error);
            return null;
          }
        }
        return null;
      });

      const results = await Promise.all(promises.filter(Boolean)); // filter out null results
      console.log("Submission results:", results);

      if (requestsMade === 0) {
        toast.error("No changes for participant attendance");
      } else {
        toast.success(`Update successful`);
      }

      // Update the initial attendance state
      setInitialAttendance(prevState => {
        const updatedAttendance = [...prevState];
        results.forEach(result => {
          if (result) {
            const index = updatedAttendance.findIndex(item => item.participantID === result.participantID);
            if (index > -1) {
              updatedAttendance[index] = result;
            } else {
              updatedAttendance.push(result);
            }
          }
        });
        return updatedAttendance;
      });
    } catch (error) {
      console.error("Overall submission error:", error);
    } finally {
      setParentIsSubmitting(false);
    }
  };

  React.useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit),
    isSubmitting
  }));

  const handleTopCheckboxChange = (dayIndex) => {
    const dayStr = (dayIndex + 1).toString();
    const allChecked = topLevelCheckboxes[dayIndex];
    paginatedRows.forEach((row, rowIndex) => {
      const attendance = new Set(watch(`attendanceData[${(currentPage - 1) * currentLimit + rowIndex}].attendance`));
      if (allChecked) {
        attendance.delete(dayStr);
      } else {
        attendance.add(dayStr);
      }
      setValue(`attendanceData[${(currentPage - 1) * currentLimit + rowIndex}].attendance`, Array.from(attendance));
    });
    setTopLevelCheckboxes(prev => {
      const newTopLevelCheckboxes = [...prev];
      newTopLevelCheckboxes[dayIndex] = !allChecked;
      return newTopLevelCheckboxes;
    });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650, tableLayout: "fixed" }} aria-label="attendance table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 100 }}>S No.</TableCell>
                <TableCell sx={{ width: 150 }}>Participant Name</TableCell>
                <TableCell sx={{ width: 200 }}>Email</TableCell>
                <TableCell sx={{ width: 150 }}>Phone</TableCell>
                {days.map((day, index) => (
                  <TableCell key={index} sx={{ width: 100 }}>
                    {/* <Checkbox
                      checked={topLevelCheckboxes[index]}
                      onChange={() => handleTopCheckboxChange(index)}
                    /> */}
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell sx={{ width: 100 }}>{row.serialNo}</TableCell>
                  <TableCell sx={{ width: 150 }}>{row.name}</TableCell>
                  <TableCell sx={{ width: 200 }}>{row.email}</TableCell>
                  <TableCell sx={{ width: 150 }}>{row.phone}</TableCell>
                  {row.attendance.map((attended, dayIndex) => (
                    <TableCell key={dayIndex} sx={{ width: 100 }}>
                      <Controller
                        name={`attendanceData[${(currentPage - 1) * currentLimit + rowIndex}].attendance`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value.includes((dayIndex + 1).toString())}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              const attendance = new Set(field.value);
                              const dayStr = (dayIndex + 1).toString();
                              if (checked) {
                                attendance.add(dayStr);
                              } else {
                                attendance.delete(dayStr);
                              }
                              setValue(`attendanceData[${(currentPage - 1) * currentLimit + rowIndex}].attendance`, Array.from(attendance));
                              setTopLevelCheckboxes(prev => {
                                const newTopLevelCheckboxes = [...prev];
                                newTopLevelCheckboxes[dayIndex] = paginatedRows.every(row => row.attendance[dayIndex] || (checked && row.serialNo === rowIndex + 1));
                                return newTopLevelCheckboxes;
                              });
                            }}
                          />
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {!paginatedRows.length ? (
          <Box sx={{ p: 3 }}>
            <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
              No Data
            </Typography>
          </Box>
        ) : null}
      </form>
    </Box>
  );
});
