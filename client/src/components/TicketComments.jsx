import React from 'react';
import AuthContext from '../AuthContext';
import * as utils from '../utils';
import { useToast } from '../hooks';
import { ToastSeverity } from './Toast';
import API from '../API';

import {
    Divider,
    Sheet,
    Box,
    Stack,
    Typography,
    Textarea,
    IconButton,
    CircularProgress,
} from '@mui/joy';
import SendIcon from '@mui/icons-material/Send';

function TicketComments({ ticketId, ticketStatus, sx }) {
    const { addToast } = useToast();

    const [loading, setLoading] = React.useState(true);
    const [comments, setComments] = React.useState([]);
    const commentsListRef = React.useRef();

    const fetchComments = () => {
        API.getComments(ticketId)
            .then((comments) => setComments(comments))
            .catch((error) => {
                addToast(error.message, { severity: ToastSeverity.ERROR });
            })
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        if (commentsListRef.current) {
            commentsListRef.current.scrollTop =
                commentsListRef.current.scrollHeight;
        }
    }, [comments]);

    React.useEffect(() => {
        fetchComments();
    }, []);

    return (
        <Sheet
            sx={{
                ...sx,
                borderRadius: 'xl',
                p: 2,
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
            variant="outlined"
        >
            {loading && comments.length === 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            {!loading && comments.length === 0 && (
                <Typography
                    variant="caption"
                    sx={{
                        textAlign: 'center',
                        color: 'text.secondary',
                    }}
                >
                    No comments yet
                </Typography>
            )}
            {comments.length > 0 && (
                <>
                    <Stack
                        spacing={2}
                        sx={{
                            position: 'relative',
                            maxHeight: 350,
                            overflowY: 'auto',
                            overflowAnchor: 'bottom',
                            scrollBehavior: 'smooth',
                        }}
                        ref={commentsListRef}
                    >
                        {comments.map((comment) => (
                            <CommentBubble comment={comment} />
                        ))}
                    </Stack>
                </>
            )}
            <Box>
                <Divider sx={{ my: 2 }} />
                <CommentInput
                    ticketId={ticketId}
                    ticketStatus={ticketStatus}
                    onSubmit={fetchComments}
                    loadingComments={loading}
                />
            </Box>
        </Sheet>
    );
}

function CommentBubble({ comment }) {
    const auth = React.useContext(AuthContext);

    const meAuthor = comment.authorId === auth.user.id;

    return (
        <Box
            sx={[
                {
                    minWidth: '60%',
                    maxWidth: '80%',
                    alignSelf: meAuthor ? 'flex-end' : 'flex-start',
                },
            ]}
        >
            <Stack
                direction="row"
                justifyContent={'space-between'}
                sx={{
                    px: 0.5,
                }}
            >
                <Typography level="title-sm">
                    {comment.authorUsername}
                </Typography>
                <Typography variant="caption" fontSize={11}>
                    {utils.formatDateFromEpoch(comment.postedAt)}
                </Typography>
            </Stack>
            <Sheet
                variant="soft"
                sx={[
                    {
                        px: 1.75,
                        py: 1.25,
                        borderRadius: 'xl',
                        whiteSpace: 'pre-wrap',
                    },
                    meAuthor
                        ? { borderTopRightRadius: 0 }
                        : { borderTopRightRadius: 'xl' },
                    meAuthor
                        ? { borderTopLeftRadius: 'xl' }
                        : { borderTopLeftRadius: 0 },
                ]}
                color={meAuthor ? 'primary' : 'neutral'}
            >
                {comment.content}
            </Sheet>
        </Box>
    );
}

function CommentInput({
    ticketId,
    ticketStatus,
    onSubmit,
    loadingComments,
    sx,
}) {
    const { addToast } = useToast();

    const [loading, setLoading] = React.useState(false);
    const [content, setContent] = React.useState('');

    const noCommentAllowed = ticketStatus === 'closed';

    const submitComment = (content) => {
        if (content.trim().length === 0) return;
        setLoading(true);
        API.createComment(ticketId, content.trim())
            .then(() => {
                setContent('');
                if (onSubmit) onSubmit();
            })
            .catch((error) => {
                addToast(error.message, { severity: ToastSeverity.ERROR });
            })
            .finally(() => setLoading(false));
    };

    return (
        <Stack
            direction="row"
            spacing={1}
            alignItems={'flex-end'}
            sx={{ ...sx }}
        >
            <Textarea
                minRows={2}
                value={content}
                sx={{
                    borderRadius: 'md',
                    width: '100%',
                }}
                placeholder={
                    noCommentAllowed
                        ? 'Ticket is closed, no more comments are allowed!'
                        : 'Add a comment'
                }
                onChange={(e) => {
                    setContent(e.target.value.slice(0, 1000));
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        // submit comment
                        submitComment(content);
                    }
                }}
                endDecorator={
                    !noCommentAllowed && (
                        <Typography level="body-xs" sx={{ ml: 'auto' }}>
                            {content.length}/1000
                        </Typography>
                    )
                }
                readOnly={noCommentAllowed || loading}
                color={noCommentAllowed ? 'warning' : 'neutral'}
                variant={noCommentAllowed ? 'soft' : 'outlined'}
            />
            <IconButton
                color="primary"
                loading={loading || loadingComments}
                variant="soft"
                disabled={
                    content.trim().length === 0 || ticketStatus === 'closed'
                }
                onClick={submitComment}
            >
                <SendIcon />
            </IconButton>
        </Stack>
    );
}

export default TicketComments;
