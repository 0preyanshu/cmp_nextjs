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
import { useCallback } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

const HOST_API = "https://zfwppq9jk2.execute-api.us-east-1.amazonaws.com/stg";

export const AttendanceTable = React.forwardRef(({ eventData, attendance, setParentIsSubmitting, currentPage = 1 ,currentLimit=10}, ref) => {

  const [initialAttendance, setInitialAttendance] = React.useState(attendance);
  const [topLevelCheckboxes, setTopLevelCheckboxes] = React.useState([]);

  const startDate = new Date(eventData.eventStartDate);
  const endDate = new Date(eventData.eventEndDate);
  const days = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(`Day ${days.length + 1}`);
  }

  



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
      attendanceData: attendance && attendance.length > 0 ? attendance : eventData.participants.map(participant => ({
        eventID: eventData.id || "",
        participantID: participant.participantID,
        attendance: []
      }))
    }
  });

  const downloadCSV = useCallback(() => {
    attendance = watch('attendanceData') || [];
    const header = ['Name', 'Email', 'Phone', ...days, 'Total Present', 'Total Absent'];
    const data = eventData.participants.map((participant) => {
      const attendanceEntry = attendance.find(item => item.participantID === participant.participantID);
      const attendanceArray = days.map((_, dayIndex) => (attendanceEntry?.attendance.includes((dayIndex + 1).toString()) ? '1' : '0'));
      const totalPresent = attendanceArray.filter(attended => attended === '1').length;
      const totalAbsent = days.length - totalPresent;

      return [
        `${participant.firstName} ${participant.lastName}`,
        participant.email,
        participant.phone,
        ...attendanceArray,
        totalPresent.toString(),
        totalAbsent.toString()
      ];
    });

    const totalPresentRow = ['Total Present', '', '', ...days.map((_, dayIndex) => data.reduce((sum, row) => sum + (row[3 + dayIndex] === '1' ? 1 : 0), 0).toString())];
    const totalAbsentRow = ['Total Absent', '', '', ...days.map((_, dayIndex) => data.reduce((sum, row) => sum + (row[3 + dayIndex] === '0' ? 1 : 0), 0).toString())];

    const csvData = [header, ...data, totalPresentRow, totalAbsentRow];
    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `attendance_${eventData.id}.csv`);
  }, [days, eventData]);

  const downloadRosterCSV = useCallback(() => {
    attendance = watch('attendanceData') || [];
    const header = ['Last Name', 'First Name', 'Email'];
    const data = eventData.participants
      .filter(participant => {
        const attendanceEntry = attendance.find(item => item.participantID === participant.participantID);
        return attendanceEntry && attendanceEntry.attendance.length === days.length;
      })
      .map(participant => [
        participant.lastName,
        participant.firstName,
        participant.email
      ]);

    const csvData = [header, ...data];
    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `roster_${eventData.id}.csv`);
  }, [days, eventData])

  const downloadAgileRosterCSV = useCallback(() => {
    const attendance = watch('attendanceData') || [];
    const header = ['User Name (same as email)', 'First Name', 'Last Name', 'Participant Email', 'Attended', 'Attendee Company'];
  
    console.log('eventData', eventData);
    console.log('attendanceData', attendance);
  
    const data = eventData.participants
      .filter(participant => {
        
        const attendanceEntry = attendance.find(item => item.participantID === participant.participantID);
        console.log('Checking participantID:', participant.participantID);
        console.log('attendanceEntry found:', attendanceEntry);
        console.log('participant', participant);
  
        return attendanceEntry && attendanceEntry.attendance.includes('1');
      })
      .map(participant => [
        participant.email,
        participant.firstName,
        participant.lastName,
        participant.email,
        '-', // As the "Attended" column in the example is not clear on the data source, using '-' as placeholder
        'Self Employed' // Assuming 'Self Employed' as company; replace this with actual data if available
      ]);
  
    console.log('Filtered and mapped data:', data);
  
    const csvData = [header, ...data];
    const csv = Papa.unparse(csvData);
  
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `roster_${eventData.id}.csv`);
  }, [days, eventData]);



  const rows = React.useMemo(() => {
    return eventData.participants.map((participant, index) => {
      const attendanceData = new Set(watch(`attendanceData[${index}].attendance`)); //can optimize this
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
      paginatedRows.every((_, participantIndex) =>
        watch(`attendanceData[${(currentPage - 1) * currentLimit + participantIndex}].attendance`).includes((dayIndex + 1).toString())
      )
    );
    setTopLevelCheckboxes(allTopLevelChecked);
  }, [watch, days.length, paginatedRows, currentPage, currentLimit]);

  const onSubmit = async data => {
    console.log('data', data);
    setParentIsSubmitting(true);
    let requestsMade = 0;

    try {
      const promises = data.attendanceData.map(async participantData => {
        const initialAttendanceEntry = initialAttendance.find(item => item.participantID === participantData.participantID)?.attendance || [];
        console.log('participantData', );
        if (JSON.stringify(initialAttendanceEntry) !== JSON.stringify(participantData.attendance)) {
          requestsMade++;
          try {
            const response = await axios.post(`${HOST_API}/event/attendance/${participantData.eventID}/${participantData.participantID}`, {
              attendance: participantData.attendance
            });

            if (!response.data.data) {
              const errorMessage = response.data.error || 'Unknown error occurred';
              toast.error(`Participant ${participantData.participantID} update failed: ${errorMessage}`);
              return null;
            }

            return { ...participantData, attendance: participantData.attendance };
          } catch (error) {
            toast.error(`Participant ${participantData.participantID} update failed`);
            return null;
          }
        }
        return null;
      });

      const results = await Promise.all(promises.filter(Boolean));

      if (requestsMade === 0) {
        toast.error("No changes for participant attendance");
      } else {
        toast.success(`Update successful`);
      }

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
    isSubmitting,
    downloadCSV,
    downloadRosterCSV,
    downloadAgileRosterCSV
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
      console.log("row",row,watch(`attendanceData[${(currentPage - 1) * currentLimit + rowIndex}].attendance`),Array.from(attendance))
      console.log("row",row,watch(`attendanceData[${(currentPage) * currentLimit + rowIndex}].attendance`),Array.from(attendance))
      setValue(`attendanceData[${(currentPage - 1) * currentLimit + rowIndex}].attendance`, Array.from(attendance));
      console.log("after");
     console.log("row",row,watch(`attendanceData[${(currentPage - 1) * currentLimit + rowIndex}].attendance`),Array.from(attendance))
     console.log("row",row,watch(`attendanceData[${(currentPage) * currentLimit + rowIndex}].attendance`),Array.from(attendance))

    });
    setTopLevelCheckboxes(prev => {
      const newTopLevelCheckboxes = [...prev];
      newTopLevelCheckboxes[dayIndex] = !allChecked;
      return newTopLevelCheckboxes;
    });
  };

  const handleIndividualCheckboxChange = (checked, dayIndex, rowIndex) => {
    const dayStr = (dayIndex + 1).toString();
    const attendance = new Set(watch(`attendanceData[${(currentPage - 1) * currentLimit + rowIndex}].attendance`));
    if (checked) {
      attendance.add(dayStr);
    } else {
      attendance.delete(dayStr);
    }
    setValue(`attendanceData[${(currentPage - 1) * currentLimit + rowIndex}].attendance`, Array.from(attendance));

    // Update top-level checkbox state
    setTopLevelCheckboxes(prev => {
      const newTopLevelCheckboxes = [...prev];
      newTopLevelCheckboxes[dayIndex] = paginatedRows.every((row, rIndex) => watch(`attendanceData[${(currentPage - 1) * currentLimit + rIndex}].attendance`).includes(dayStr));
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
                  <TableCell key={index} sx={{ width: 130 }}>
                    <Checkbox
                      checked={paginatedRows.length === 0 ? false : (topLevelCheckboxes.length >= index + 1 ? topLevelCheckboxes[index] : false)}
                      onChange={() => handleTopCheckboxChange(index)}
                      sx={{ marginRight: 1 }}
                    />
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
                    <TableCell key={dayIndex} sx={{ width: 130 }}>

                    
                      <Controller
                        name={`attendanceData[${(currentPage - 1) * currentLimit + rowIndex}].attendance`}
                        control={control}
                        render={({ field }) => {
                          // console.log('field', field.value)
                          console.log(watch(`attendanceData[${(currentPage-1) * currentLimit + rowIndex}].attendance`),`attendanceData[${(currentPage-1) * currentLimit + rowIndex}].attendance`,field.value);
                          
                          return(
                          
                          <Checkbox
                            checked={watch(`attendanceData[${(currentPage-1) * currentLimit + rowIndex}].attendance`).includes((dayIndex + 1).toString())}
                            onChange={(e) => {
                              handleIndividualCheckboxChange(e.target.checked, dayIndex, rowIndex);
                            }}
                          />
                        )}}
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
