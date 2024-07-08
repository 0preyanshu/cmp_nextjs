import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  FormGroup
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { privileges } from './privileges'; // Adjust the path as needed
import { Privilages } from '@/components/core/privilages';

const PrivilegesForm = ({ selectedPrivileges, onChange }) => {
  const [checked, setChecked] = React.useState({});

  React.useEffect(() => {
    const initialChecked = {};

    // Initialize checked state for nestedPrivileges
    Object.keys(Privilages.nestedPrivilages).forEach(category => {
      initialChecked[category] = Privilages.nestedPrivilages[category].reduce((acc, privilege) => {
        acc[privilege.id] = selectedPrivileges.includes(String(privilege.id));
        return acc;
      }, {});
    });

    // Initialize checked state for genericPrivileges
    initialChecked.genericPrivileges = Privilages.genericPrivilages.reduce((acc, privilege) => {
      acc[privilege.id] = selectedPrivileges.includes(String(privilege.id));
      return acc;
    }, {});

    setChecked(initialChecked);
  }, [selectedPrivileges]);

  const handleToggle = (category, privilegeId) => {
    const newChecked = {
      ...checked,
      [category]: {
        ...checked[category],
        [privilegeId]: !checked[category][privilegeId],
      },
    };
    setChecked(newChecked);
    updateSelectedPrivileges(newChecked);
  };

  const handleSelectAll = (category, privileges) => {
    const allSelected = privileges.every(privilege => checked[category][privilege.id]);
    const newChecked = privileges.reduce((acc, privilege) => {
      acc[privilege.id] = !allSelected;
      return acc;
    }, {});
    setChecked(prevState => ({
      ...prevState,
      [category]: newChecked,
    }));
    updateSelectedPrivileges({
      ...checked,
      [category]: newChecked,
    });
  };

  const updateSelectedPrivileges = (newChecked) => {
    const selected = [];
    Object.keys(newChecked).forEach(category => {
      Object.keys(newChecked[category]).forEach(id => {
        if (newChecked[category][id]) {
          selected.push(String(id));
        }
      });
    });
    onChange(selected);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Accordion sx={{ boxShadow: 'none', border: 'none', '&:before': { display: 'none' } }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="genericPrivileges-content"
          id="genericPrivileges-header"
          sx={{ borderBottom: 'none' }}
        >
          <Typography>Generic Privileges</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    Privilages.genericPrivilages.every(
                      privilege => checked.genericPrivileges?.[privilege.id]
                    )
                  }
                  onChange={() => handleSelectAll('genericPrivileges', Privilages.genericPrivilages)}
                />
              }
              label="Select All"
            />
            {Privilages.genericPrivilages.map(privilege => (
              <FormControlLabel
                key={privilege.id}
                control={
                  <Checkbox
                    checked={checked.genericPrivileges?.[privilege.id] || false}
                    onChange={() => handleToggle('genericPrivileges', privilege.id)}
                  />
                }
                label={privilege.privilegeName}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {Object.keys(Privilages.nestedPrivilages).map(category => (
        <Accordion key={category} sx={{ boxShadow: 'none', border: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${category}-content`}
            id={`${category}-header`}
            sx={{ borderBottom: 'none' }}
          >
            <Typography>{category}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      Privilages.nestedPrivilages[category].every(
                        privilege => checked[category]?.[privilege.id]
                      )
                    }
                    onChange={() => handleSelectAll(category, Privilages.nestedPrivilages[category])}
                  />
                }
                label="Select All"
              />
              {Privilages.nestedPrivilages[category].map(privilege => (
                <FormControlLabel
                  key={privilege.id}
                  control={
                    <Checkbox
                      checked={checked[category]?.[privilege.id] || false}
                      onChange={() => handleToggle(category, privilege.id)}
                    />
                  }
                  label={privilege.privilegeName}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default PrivilegesForm;
