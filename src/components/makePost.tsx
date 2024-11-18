import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { useState } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { FloatLabel } from "primereact/floatlabel";
import { createPost } from "./api";

function MakePost() {
  const [isShowing, toggleIsShowing] = useState(false);
  const [username, setUsername] = useState("");

  const [body, setBody] = useState("");
  return (
    <div>
      <Button
        label="Add post"
        icon="pi pi-plus"
        onClick={() => toggleIsShowing(true)}
        aria-controls={isShowing ? "dlg" : null}
        aria-expanded={isShowing}
        severity="help"
      />
      <Dialog
        visible={isShowing}
        onHide={() => {
          toggleIsShowing(!isShowing);
        }}
        header="New Post"
      >
        <div
          className="flex flex-column px-8 py-5 gap-4"
          style={{
            borderRadius: "12px",
          }}
        >
          <form>
            <Panel>
              {/* The following float label for username is for testing only */}
              <FloatLabel>
                <InputText
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  id="username"
                />
                <label htmlFor="username">Testing Username</label>
              </FloatLabel>
            </Panel>
            <Panel>
              <MDEditor
                value={body}
                onChange={setBody}
                textareaProps={{
                  placeholder: "Markdown suportedt",
                }}
                commands={[
                  commands.codeEdit,
                  commands.codePreview,
                  commands.bold,
                  commands.italic,
                  commands.title,
                  commands.title1,
                  commands.title3,
                  commands.title4,
                  commands.image,
                ]}
              />
              <MDEditor.Markdown
                source={body}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </Panel>
            <Panel>
              <Button
                severity="danger"
                label="Cancel"
                icon="pi pi-times"
                onClick={() => {
                  setBody("");
                  setUsername("");
                  toggleIsShowing(!isShowing);
                }}
              />
              <Button
                className="m-5"
                severity="success"
                label="Post"
                icon="pi pi-check"
                onClick={() => {
                  createPost(username, body);
                  setBody("");
                  setUsername("");
                  toggleIsShowing(!isShowing);
                }}
              />
            </Panel>
          </form>
        </div>
      </Dialog>
    </div>
  );
}

export default MakePost;
