import Editor, { ControlledEditor, DiffEditor } from "@monaco-editor/react";
import Markdown from "markdown-to-jsx";
import * as PropTypes from "prop-types";
import * as React from "react";

import { CardBottomCorners, CardTopCorners } from "../Card/Card.style";
import { PENDING, RIGHT, WRONG } from "../Chapters/ChapterAbout/ChapterAbout.constants";
//prettier-ignore
import { Button, ButtonBorder, ButtonText, ChapterCourse, ChapterGrid, ChapterH1, ChapterH2, ChapterItalic, ChapterMonaco, ChapterStyled, ChapterValidator, ChapterValidatorContent, ChapterValidatorContentWrapper, ChapterValidatorInside, ChapterValidatorTitle } from "../Chapters/ChapterAbout/ChapterAbout.style";
import { Dialog } from "../Dialog/Dialog.controller";
import { Light } from "../Light/Light.view";

const MonacoReadOnly = ({ children }: any) => {
  const height = children.split("\n").length * 22;
  return (
    <div style={{ marginTop: "10px" }}>
      <Editor
        height={height}
        value={children}
        language="pascaligo"
        theme="myCustomTheme"
        options={{
          lineNumbers: false,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          scrollbar: { vertical: "hidden", verticalScrollbarSize: 0, alwaysConsumeMouseWheel: false },
          folding: false,
          readOnly: true,
          fontSize: 14,
          fontFamily: "Roboto",
        }}
      />
    </div>
  );
};

const MonacoEditor = ({ proposedSolution, proposedSolutionCallback }: any) => {
  return (
    <div>
      <ControlledEditor
        height="440px"
        value={proposedSolution}
        language="pascaligo"
        theme="myCustomTheme"
        onChange={(_, val) => proposedSolutionCallback(val)}
        options={{
          lineNumbers: true,
          scrollBeyondLastLine: true,
          minimap: { enabled: false },
          scrollbar: { vertical: "hidden", verticalScrollbarSize: 0 },
          folding: true,
          readOnly: false,
          fontSize: 14,
          fontFamily: "Roboto",
        }}
      />
    </div>
  );
};

const MonacoDiff = ({ solution, proposedSolution }: any) => {
  return (
    <div>
      <DiffEditor
        height="440px"
        original={solution}
        modified={proposedSolution}
        language="pascaligo"
        // @ts-ignore
        theme="myCustomTheme"
        options={{
          lineNumbers: true,
          scrollBeyondLastLine: true,
          minimap: { enabled: false },
          scrollbar: { vertical: "hidden", verticalScrollbarSize: 0 },
          folding: true,
          readOnly: false,
          fontSize: 14,
          fontFamily: "Roboto",
          renderSideBySide: false,
        }}
      />
    </div>
  );
};

const Validator = ({ validatorState, validateCallback }: any) => (
  <ChapterValidator className={validatorState === RIGHT ? "ok" : "no"}>
    <CardTopCorners className={validatorState === RIGHT ? "ok" : "no"} />
    <CardBottomCorners className={validatorState === RIGHT ? "ok" : "no"} />
    <ChapterValidatorInside className={validatorState === RIGHT ? "ok" : "no"}>
      {validatorState === PENDING && (
        <ChapterValidatorContentWrapper>
          <ChapterValidatorTitle>AWAITING VALIDATION</ChapterValidatorTitle>
          <ChapterValidatorContent>Type your solution above and validate your answer</ChapterValidatorContent>
          <Button>
            <ButtonBorder />
            <ButtonText onClick={() => validateCallback()}>VALIDATE MISSION</ButtonText>
          </Button>
        </ChapterValidatorContentWrapper>
      )}
      {validatorState === RIGHT && (
        <ChapterValidatorContentWrapper>
          <ChapterValidatorTitle>MISSION SUCCESSFUL</ChapterValidatorTitle>
          <ChapterValidatorContent>Go on to the next mission</ChapterValidatorContent>
        </ChapterValidatorContentWrapper>
      )}
      {validatorState === WRONG && (
        <ChapterValidatorContentWrapper>
          <ChapterValidatorTitle>MISSION FAILED</ChapterValidatorTitle>
          <ChapterValidatorContent>Checkout the solution above and try again</ChapterValidatorContent>
          <Button>
            <ButtonBorder />
            <ButtonText onClick={() => validateCallback()}>TRY AGAIN</ButtonText>
          </Button>
        </ChapterValidatorContentWrapper>
      )}
    </ChapterValidatorInside>
  </ChapterValidator>
);

const Content = ({ course }: any) => (
  <Markdown
    children={course}
    options={{
      // disableParsingRawHTML: true,
      overrides: {
        h1: {
          component: ChapterH1,
        },
        h2: {
          component: ChapterH2,
        },
        code: {
          component: MonacoReadOnly,
        },
        em: {
          component: ChapterItalic,
        },
        dialog: {
          component: Dialog,
        },
        light: {
          component: Light,
        },
      },
    }}
  />
);

type ChapterViewProps = {
  validatorState: string;
  validateCallback: () => void;
  solution: string;
  proposedSolution: string;
  proposedSolutionCallback: (e: string) => void;
  showDiff: boolean;
  course?: string;
};

export const ChapterView = ({
  validatorState,
  validateCallback,
  solution,
  proposedSolution,
  proposedSolutionCallback,
  showDiff,
  course,
}: ChapterViewProps) => {
  return (
    <ChapterStyled>
      <ChapterCourse>
        <Content course={course || ""} />
      </ChapterCourse>
      <ChapterGrid>
        <ChapterMonaco>
          {showDiff ? (
            <MonacoDiff solution={solution} proposedSolution={proposedSolution} />
          ) : (
            <MonacoEditor proposedSolution={proposedSolution} proposedSolutionCallback={proposedSolutionCallback} />
          )}
        </ChapterMonaco>
        <Validator validatorState={validatorState} validateCallback={validateCallback} />
      </ChapterGrid>
    </ChapterStyled>
  );
};

ChapterView.propTypes = {
  validatorState: PropTypes.string,
  validateCallback: PropTypes.func.isRequired,
  solution: PropTypes.string,
  proposedSolution: PropTypes.string,
  showDiff: PropTypes.bool.isRequired,
  proposedSolutionCallback: PropTypes.func.isRequired,
  course: PropTypes.string,
};

ChapterView.defaultProps = {
  validatorState: PENDING,
  solution: "",
  proposedSolution: "",
};
