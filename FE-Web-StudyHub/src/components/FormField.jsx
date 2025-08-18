import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";

const FormField = ({
  name,
  control,
  label,
  type = "text",
  options = [],
  startIcon,
  endIcon,
  onEndIconClick,
  className = "",
  sx = {},
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        if (type === "select") {
          return (
            <FormControl
              fullWidth
              error={!!fieldState.error}
              className={className}
              sx={sx}
            >
              <InputLabel>{label}</InputLabel>
              <Select {...field} label={label} {...props}>
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {fieldState.error && (
                <FormHelperText>{fieldState.error.message}</FormHelperText>
              )}
            </FormControl>
          );
        }

        return (
          <TextField
            {...field}
            fullWidth
            label={label}
            type={type}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            variant="outlined"
            className={className}
            sx={sx}
            slotProps={{
              input: {
                startAdornment: startIcon ? (
                  <InputAdornment
                    position="start"
                    sx={{ pointerEvents: "none" }}
                  >
                    {startIcon}
                  </InputAdornment>
                ) : undefined,
                endAdornment: endIcon ? (
                  <InputAdornment position="end">
                    {" "}
                    <IconButton
                      onClick={onEndIconClick}
                      edge="end"
                      tabIndex={-1}
                    ></IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
            {...props}
          />
        );
      }}
    />
  );
};
export default FormField;
