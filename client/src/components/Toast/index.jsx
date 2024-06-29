import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

const ToastSeverity = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'danger',
};

const ToastIcons = {
    [ToastSeverity.INFO]: <InfoIcon />,
    [ToastSeverity.SUCCESS]: <CheckCircleIcon />,
    [ToastSeverity.WARNING]: <WarningIcon />,
    [ToastSeverity.ERROR]: <ErrorIcon />,
};

export { ToastSeverity, ToastIcons };
