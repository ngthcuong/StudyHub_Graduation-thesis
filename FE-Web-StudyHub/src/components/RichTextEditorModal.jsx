import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  Paper,
  Toolbar,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatStrikethrough as StrikethroughIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  FormatAlignJustify as AlignJustifyIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

const MenuButton = ({ onClick, isActive, disabled, children, tooltip }) => (
  <Tooltip title={tooltip}>
    <IconButton
      onClick={onClick}
      disabled={disabled}
      size="small"
      sx={{
        mx: 0.25,
        borderRadius: 1.5,
        bgcolor: isActive ? "#667eea" : "transparent",
        color: isActive ? "white" : "text.primary",
        border: "2px solid",
        borderColor: isActive ? "#667eea" : "#e0e0e0",
        minWidth: 36,
        minHeight: 36,
        fontWeight: isActive ? 600 : 400,
        boxShadow: isActive ? "0 2px 8px rgba(102, 126, 234, 0.3)" : "none",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: isActive ? "#5568d3" : "#f0f2ff",
          borderColor: isActive ? "#5568d3" : "#667eea",
          transform: "translateY(-1px)",
          boxShadow: isActive
            ? "0 4px 12px rgba(102, 126, 234, 0.4)"
            : "0 2px 8px rgba(102, 126, 234, 0.15)",
        },
        "&:disabled": {
          color: "text.disabled",
          bgcolor: "transparent",
          borderColor: "#e0e0e0",
          boxShadow: "none",
          transform: "none",
        },
        "&:active": {
          transform: "translateY(0)",
        },
      }}
    >
      {children}
    </IconButton>
  </Tooltip>
);

const RichTextEditorModal = ({
  open,
  onClose,
  onSave,
  initialContent = "",
  lessonName = "Lesson",
  title = "Edit Lesson Content",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable built-in lists completely
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing your lesson content here...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
      },
    },
  });

  // Update editor content when initialContent changes
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      onSave(content);
      onClose();
    }
  };

  // Helper function to get active state
  const getIsActive = (type, attributes = {}) => {
    if (!editor) return false;
    return editor.isActive(type, attributes);
  };

  const handleClose = () => {
    onClose();
  };

  if (!editor) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          p: 3,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                borderRadius: 3,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArticleIcon sx={{ fontSize: 28 }} />
            </Box>
            <div>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {lessonName}
              </Typography>
            </div>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              color: "white",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
                transform: "rotate(90deg)",
                transition: "all 0.3s ease",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Toolbar */}
        <Paper
          elevation={0}
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "#f8f9fa",
            flexShrink: 0,
          }}
        >
          <Toolbar
            variant="dense"
            sx={{
              gap: 1,
              py: 1.5,
              px: 2,
              minHeight: "auto !important",
              flexWrap: "wrap",
            }}
          >
            {/* Text Formatting */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <MenuButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={getIsActive("bold")}
                tooltip="Bold (Ctrl+B)"
              >
                <BoldIcon fontSize="small" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={getIsActive("italic")}
                tooltip="Italic (Ctrl+I)"
              >
                <ItalicIcon fontSize="small" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={getIsActive("underline")}
                tooltip="Underline (Ctrl+U)"
              >
                <UnderlineIcon fontSize="small" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={getIsActive("strike")}
                tooltip="Strikethrough"
              >
                <StrikethroughIcon fontSize="small" />
              </MenuButton>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Text Alignment */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <MenuButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                isActive={
                  getIsActive("paragraph", { textAlign: "left" }) ||
                  (!getIsActive("paragraph", { textAlign: "center" }) &&
                    !getIsActive("paragraph", { textAlign: "right" }) &&
                    !getIsActive("paragraph", { textAlign: "justify" }))
                }
                tooltip="Align Left"
              >
                <AlignLeftIcon fontSize="small" />
              </MenuButton>
              <MenuButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                isActive={getIsActive("paragraph", { textAlign: "center" })}
                tooltip="Align Center"
              >
                <AlignCenterIcon fontSize="small" />
              </MenuButton>
              <MenuButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                isActive={getIsActive("paragraph", { textAlign: "right" })}
                tooltip="Align Right"
              >
                <AlignRightIcon fontSize="small" />
              </MenuButton>
              <MenuButton
                onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                isActive={getIsActive("paragraph", { textAlign: "justify" })}
                tooltip="Justify"
              >
                <AlignJustifyIcon fontSize="small" />
              </MenuButton>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Undo/Redo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <MenuButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                tooltip="Undo (Ctrl+Z)"
              >
                <UndoIcon fontSize="small" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                tooltip="Redo (Ctrl+Y)"
              >
                <RedoIcon fontSize="small" />
              </MenuButton>
            </Box>
          </Toolbar>
        </Paper>

        {/* Editor */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            bgcolor: "white",
            overflow: "auto",
            "& .tiptap-editor-content": {
              outline: "none",
              minHeight: "400px",
              fontSize: "16px",
              lineHeight: 1.6,
              color: "text.primary",
              "& p": {
                margin: "0 0 1em 0",
                "&:last-child": {
                  marginBottom: 0,
                },
                "&[style*='text-align: center']": {
                  textAlign: "center",
                },
                "&[style*='text-align: right']": {
                  textAlign: "right",
                },
                "&[style*='text-align: justify']": {
                  textAlign: "justify",
                },
              },
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                fontWeight: 600,
                lineHeight: 1.3,
                marginTop: "2em",
                marginBottom: "1em",
                "&:first-child": {
                  marginTop: 0,
                },
                "&[style*='text-align: center']": {
                  textAlign: "center",
                },
                "&[style*='text-align: right']": {
                  textAlign: "right",
                },
                "&[style*='text-align: justify']": {
                  textAlign: "justify",
                },
              },
              "& h1": { fontSize: "2em" },
              "& h2": { fontSize: "1.5em" },
              "& h3": { fontSize: "1.25em" },

              "& blockquote": {
                borderLeft: "3px solid #667eea",
                paddingLeft: "1em",
                margin: "1em 0",
                fontStyle: "italic",
                bgcolor: "#f8f9ff",
                borderRadius: "0 8px 8px 0",
                padding: "1em",
              },
              "& code": {
                bgcolor: "#f4f4f4",
                padding: "0.2em 0.4em",
                borderRadius: "4px",
                fontSize: "0.9em",
                fontFamily: "monospace",
              },
              "& pre": {
                bgcolor: "#f4f4f4",
                padding: "1em",
                borderRadius: "8px",
                overflow: "auto",
                "& code": {
                  bgcolor: "transparent",
                  padding: 0,
                },
              },
              "& .ProseMirror-placeholder": {
                color: "#adb5bd",
                pointerEvents: "none",
                height: 0,
                "&::before": {
                  content: "attr(data-placeholder)",
                  float: "left",
                },
              },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          bgcolor: "#f8f9fa",
          borderTop: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            py: 1,
            fontWeight: 600,
            color: "text.secondary",
            borderColor: "divider",
            "&:hover": {
              borderColor: "text.secondary",
              bgcolor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 4,
            py: 1,
            fontWeight: 600,
            bgcolor: "#667eea",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            "&:hover": {
              bgcolor: "#5568d3",
              boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
            },
          }}
        >
          Save Content
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RichTextEditorModal;
