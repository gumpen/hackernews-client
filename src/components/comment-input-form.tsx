"use client";

import { RefObject } from "react";

interface Props {
  formAction: ((form: FormData) => void) | ((form: FormData) => Promise<void>);
  parentId: number;
  ancestorId: number;
  submitTitle: string;
  formRef?: RefObject<HTMLFormElement>;
  goto?: string;
}

export const CommentInputForm = ({
  formAction,
  parentId,
  ancestorId,
  submitTitle,
  formRef,
  goto,
}: Props) => {
  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="parent" value={parentId}></input>
      <input type="hidden" name="ancestor" value={ancestorId}></input>
      {goto ? <input type="hidden" name="goto" value={goto}></input> : <></>}
      <textarea
        name="text"
        className="text-xs border border-gray-500 py-px px-0.5"
        rows={8}
        cols={80}
      ></textarea>
      <br />
      <br />
      <input
        className="border border-gray-500 bg-gray-200 text-sm py-px px-1.5"
        type="submit"
        value={submitTitle}
      ></input>
    </form>
  );
};
