import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';

import {
    Button,
    Box,
    Chip,
    Modal,
    ModalDialog,
    DialogTitle,
    DialogContent,
    Input,
    Select,
    Option,
    Textarea,
    Stack,
    FormControl,
    FormLabel,
    Stepper,
    Step,
    StepIndicator,
    Typography,
} from '@mui/joy';
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { motion, AnimatePresence } from 'framer-motion';

function CreateTicketModal() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        console.log('Submit', title, description, category);

        /* API.createTicket({ title, description, category }).then(() => {
            navigate('/');
        }); */
    };

    return (
        <Modal open onClose={() => navigate('/')}>
            <ModalDialog sx={{ width: 600 }}>
                <DialogTitle>Open new ticket</DialogTitle>
                <DialogContent>
                    <Stepper
                        sx={{ width: '90%', margin: 'auto', mb: 2, mt: 2 }}
                    >
                        <Step
                            indicator={
                                <StepIndicator variant="solid" color="primary">
                                    {step === 1 ? '1' : <CheckIcon />}
                                </StepIndicator>
                            }
                        >
                            Edit
                        </Step>
                        <Step
                            indicator={
                                <StepIndicator
                                    variant={step === 2 ? 'solid' : 'outlined'}
                                    color="primary"
                                >
                                    2
                                </StepIndicator>
                            }
                        >
                            Review
                        </Step>
                    </Stepper>
                    <Box
                        sx={{
                            mb: 2,
                            display: 'flex',
                            height: '40dvh',
                            overflowY: 'auto',
                        }}
                    >
                        <AnimatePresence initial={false} mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="edit"
                                    style={{
                                        width: '100%',
                                    }}
                                    initial={{
                                        x: 0,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        x: 0,
                                        opacity: 1,
                                    }}
                                    exit={{
                                        x: '-100vw',
                                        opacity: 0,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        ease: 'easeInOut',
                                    }}
                                >
                                    <EditTicketForm
                                        title={title}
                                        setTitle={setTitle}
                                        description={description}
                                        setDescription={setDescription}
                                        category={category}
                                        setCategory={setCategory}
                                    />
                                </motion.div>
                            )}
                            {step === 2 && (
                                <motion.div
                                    key="review"
                                    style={{
                                        width: '100%',
                                    }}
                                    initial={{
                                        x: '100vw',
                                        opacity: 0,
                                    }}
                                    animate={{
                                        x: 0,
                                        opacity: 1,
                                    }}
                                    exit={{
                                        x: '100vw',
                                        opacity: 0,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        ease: 'easeInOut',
                                    }}
                                >
                                    <ReviewTicketForm
                                        title={title}
                                        description={description}
                                        category={category}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        {step === 1 && (
                            <Button
                                type="button"
                                variant="outlined"
                                sx={{ width: '100%' }}
                                onClick={() => navigate('/')}
                            >
                                Cancel
                            </Button>
                        )}
                        {step === 2 && (
                            <Button
                                type="button"
                                variant="outlined"
                                sx={{ width: '100%' }}
                                onClick={() => setStep(1)}
                            >
                                Back
                            </Button>
                        )}
                        {step === 1 && (
                            <Button
                                type="button"
                                variant="solid"
                                sx={{ width: '100%' }}
                                onClick={() => setStep(2)}
                                endDecorator={<KeyboardArrowRight />}
                                disabled={!title || !description || !category}
                            >
                                Next
                            </Button>
                        )}
                        {step === 2 && (
                            <Button
                                type="submit"
                                variant="solid"
                                color="primary"
                                sx={{ width: '100%' }}
                                endDecorator={<SendIcon />}
                                onClick={handleSubmit}
                            >
                                Open ticket
                            </Button>
                        )}
                    </Stack>
                </DialogContent>
            </ModalDialog>
        </Modal>
    );
}

function EditTicketForm({
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
}) {
    return (
        <Stack spacing={2}>
            <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                    name="category"
                    placeholder="Select a category"
                    value={category}
                    onChange={(e, v) => setCategory(v)}
                >
                    {API.Ticket.CATEGORIES.map((category) => (
                        <Option key={category} value={category}>
                            {category}
                        </Option>
                    ))}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </FormControl>
            <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                    name="description"
                    placeholder="Provide a description..."
                    value={description}
                    minRows={3}
                    onChange={(e) =>
                        setDescription(e.target.value.slice(0, 1000))
                    }
                    endDecorator={
                        <Typography level="body-xs" sx={{ ml: 'auto' }}>
                            {description.length}/1000
                        </Typography>
                    }
                />
            </FormControl>
        </Stack>
    );
}

function ReviewTicketForm({ title, description, category }) {
    return (
        <Stack spacing={2}>
            <Box>
                <Typography level="title-lg">Category</Typography>
                <Chip color="neutral" variant="outlined" sx={{ mt: 1 }}>
                    {category}
                </Chip>
            </Box>
            <Box>
                <Typography level="title-lg">Title</Typography>
                <Typography>{title}</Typography>
            </Box>
            <Box>
                <Typography level="title-lg">Description</Typography>
                <Typography
                    sx={{
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {description}
                </Typography>
            </Box>
        </Stack>
    );
}

export default CreateTicketModal;
