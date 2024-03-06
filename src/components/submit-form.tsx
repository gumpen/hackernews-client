"use client";

import { useState, ChangeEvent } from "react";
import { useFormState } from "react-dom";
import { postStory, PostStoryActionState } from "@/app/actions";

export const SubmitForm = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [formState, formAction] = useFormState(
    postStory,
    {} as PostStoryActionState
  );

  const onTitleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setTitle(ev.target.value);
  };

  const onUrlChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setUrl(ev.target.value);
  };

  const isValidUrl = (s: string) => {
    try {
      const url = new URL(s);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <form className="mb-4" action={formAction}>
      <table className="text-sm border-separate">
        <tbody>
          <tr>
            <td className="text-content-gray">title</td>
            <td>
              <input
                className="border border-gray-500 py-px px-0.5"
                type="text"
                name="title"
                size={50}
                onChange={onTitleChange}
              ></input>
              {title.length > 80 && (
                <span className="ml-2 text-content-gray">{`${title.length - 80} too long`}</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="text-content-gray">url</td>
            <td>
              <input
                className="border border-gray-500 py-px px-0.5"
                type="url"
                name="url"
                size={50}
                onChange={onUrlChange}
              ></input>
              {url.length > 0 && !isValidUrl(url) && (
                <span className="ml-2">invalid URL format</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="text-content-gray">text</td>
            <td>
              <textarea
                className="border border-gray-500 py-px px-0.5"
                name="text"
                rows={4}
                cols={49}
              ></textarea>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>
              <input
                className="border border-gray-500 bg-gray-200 text-sm py-px px-1.5"
                type="submit"
                value="submit"
              ></input>
            </td>
          </tr>
          <tr className="h-5"></tr>
          <tr>
            <td></td>
            <td className="text-content-gray">
              Leave url blank to submit a question for discussion. If there is
              no url, text will appear at the top of the thread. If there is a
              url, text is optional.
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};
