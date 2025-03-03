import React, { useState } from 'react';
import {
  Card,
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { FilterUIProps } from './DataTable.types';

const FilterUI: React.FC<FilterUIProps> = ({ filters, onApplyFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string | string[]>>({});
  const [showFilters, setShowFilters] = useState<boolean>(true);

  const handleChange = (key: string, value: string | string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card sx={{ padding: 2, marginBottom: 2, minHeight: 'auto' }}>
      <Grid container spacing={2}>
        {/* Header Section */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Typography variant="h6">Filter Options</Typography>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer', marginBottom: '8px' }}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Typography>
          <Button variant="contained" sx={{ marginTop: '12px' }} onClick={() => onApplyFilters(selectedFilters)}>
            Apply
          </Button>
          {!showFilters && (
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              {Object.entries(selectedFilters).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
                </div>
              ))}
            </Typography>
          )}
        </Grid>

        {/* Filters Section */}
        {showFilters && (
          <Grid container spacing={2} size={{ xs: 12, md: 10 }}>
            {filters.map(({ label, labelKey, type, options }) => (
              <Grid container spacing={2} size={{ xs: 12, sm: 6 }} key={labelKey} alignItems="center">
                {/* Filter Label */}
                <Grid size={{ xs: 2 }} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1">{label}</Typography>
                </Grid>

                {/* Filter Input */}
                <Grid size={{ xs: 10 }}>
                  {type === 'checkbox' && options && (
                    <FormControl component="fieldset" >
                      <Grid container spacing={1} direction="column">
                        {Object.entries(options).map(([key, value]) => (
                          <Grid key={key}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={(selectedFilters[labelKey] as string[])?.includes(key) || false}
                                  onChange={(e) => {
                                    const currentValues = (selectedFilters[labelKey] as string[]) || [];
                                    handleChange(
                                      labelKey,
                                      e.target.checked
                                        ? [...currentValues, key]
                                        : currentValues.filter((v) => v !== key)
                                    );
                                  }}
                                />
                              }
                              label={value}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormControl>
                  )}

                  {type === 'radio' && options && (
                    <FormControl component="fieldset" fullWidth>
                      <RadioGroup
                        value={selectedFilters[labelKey] || ''}
                        onChange={(e) => handleChange(labelKey, e.target.value)}
                      >
                        {Object.entries(options).map(([key, value]) => (
                          <FormControlLabel key={key} value={key} control={<Radio />} label={value} />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}

                  {type === 'dropdown' && options && (
                    <Select
                      value={selectedFilters[labelKey] || ''}
                      onChange={(e) => handleChange(labelKey, e.target.value)}
                      displayEmpty
                      
                      sx={{ marginTop: 1 }}
                    >
                      <MenuItem value="" disabled>
                        Select {labelKey}
                      </MenuItem>
                      {Object.entries(options).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  )}

                  {type === 'date' && (
                    <TextField
                      type="date"
                      value={selectedFilters[labelKey] || ''}
                      onChange={(e) => handleChange(labelKey, e.target.value)}
                      fullWidth
                      sx={{ marginTop: 1 }}
                    />
                  )}

                  {type === 'date_range' && (
                    <Grid container spacing={1}>
                      <TextField
                        type="date"
                        value={(selectedFilters[labelKey] as string[])?.[0] || ''}
                        onChange={(e) =>
                          handleChange(labelKey, [e.target.value, (selectedFilters[labelKey] as string[])?.[1] || ''])
                        }
                        fullWidth
                        sx={{ marginTop: 1 }}
                      />
                      <TextField
                        type="date"
                        value={(selectedFilters[labelKey] as string[])?.[1] || ''}
                        onChange={(e) =>
                          handleChange(labelKey, [(selectedFilters[labelKey] as string[])?.[0] || '', e.target.value])
                        }
                        fullWidth
                        sx={{ marginTop: 1 }}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default FilterUI;
