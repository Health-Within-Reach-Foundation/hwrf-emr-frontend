import { LexicalComposer } from "@lexical/react/LexicalComposer";
import * as React from "react";
import "./index.css";
import { FlashMessageContext } from "./context/FlashMessageContext";
// import { useSettings } from "./context/SettingsContext";
import Editor from "./Editor";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import { TableContext } from "./plugins/TablePlugin";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
function App({
  setEditorContent,
  defaultEditorContent,
  setHtmlToDownload,
  optionalToolbar,
  policy = false,
  editable = true,
  onKeyPress,
  draft_id,
}) {
  let initialEditorState;

  try {
    // If defaultEditorContent is a string, parse it
    const parsedContent =
      typeof defaultEditorContent === "string"
        ? defaultEditorContent
        : defaultEditorContent;

    // Check if parsedContent is a valid editor state
    initialEditorState =
      Object.keys(parsedContent.toJSON ? parsedContent.toJSON() : parsedContent)
        .length === 0
        ? null
        : parsedContent;
  } catch (error) {
    // Handle JSON parse errors or invalid editor content
    console.error("Error parsing defaultEditorContent:", error);
    initialEditorState = null;
  }

  let initialConfig = {
    editorState: initialEditorState,
    namespace: "Mammography Report",
    nodes: [...PlaygroundNodes],
    onError: (error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };
  let initialConfigReadOnly = {
    editorState: initialEditorState,
    namespace: "Policy",
    nodes: [...PlaygroundNodes],
    onError: (error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
    editable: false,
  };
  return (
    <LexicalComposer
      initialConfig={editable ? initialConfig : initialConfigReadOnly}
    >
      <TableContext>
        <div className="editor-shell">
          <Editor
            setEditorContent={setEditorContent}
            setHtmlToDownload={setHtmlToDownload}
            editable={editable}
            optionalToolbar={optionalToolbar}
            policy={policy}
            draft_id={draft_id}
            onKeyPress={onKeyPress}
          />
        </div>
      </TableContext>
      <OnChangePlugin
        onChange={(editorstate) => setEditorContent(editorstate)}
      />
    </LexicalComposer>
  );
}

export default function PlaygroundApp({
  setEditorContent,
  defaultEditorContent,
  setHtmlToDownload,
  editable = true,
  optionalToolbar,
  policy = false,
  onKeyPress,
  draft_id,
}) {
  return (
    <FlashMessageContext>
      <App
        setEditorContent={setEditorContent}
        defaultEditorContent={defaultEditorContent}
        setHtmlToDownload={setHtmlToDownload}
        editable={editable}
        optionalToolbar={optionalToolbar}
        policy={policy}
        onKeyPress={onKeyPress}
        draft_id={draft_id}
      />
    </FlashMessageContext>
  );
}
