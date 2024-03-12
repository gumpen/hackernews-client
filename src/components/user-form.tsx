"use client";

import { User } from "@prisma/client";
import { UpdateUserActionState, updateUser } from "@/app/actions";
import { getDateComponents } from "@/lib/util";
import Link from "next/link";
import { useFormState } from "react-dom";

interface Props {
  currentUser: User | undefined;
  displayUser: User;
}

export const UserForm = (props: Props) => {
  const { currentUser, displayUser } = props;

  const [formState, formDispatch] = useFormState(
    updateUser,
    {} as UpdateUserActionState
  );

  const formatDateString = (d: Date) => {
    const { year, month, day } = getDateComponents(d);
    const monthString = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][month];

    return `${monthString} ${day}, ${year}`;
  };

  if (currentUser && currentUser.id === displayUser.id) {
    return (
      <form className="mb-4" action={formDispatch}>
        <input type="hidden" name="id" value={currentUser.id} />
        <table className="text-sm text-content-gray border-separate">
          <tbody>
            <tr>
              <td className="align-top">user:</td>
              <td>
                <Link href={`/user?id=${currentUser.id}`}>
                  {currentUser.id}
                </Link>
              </td>
            </tr>
            <tr>
              <td className="align-top">created:</td>
              <td>{formatDateString(currentUser.created)}</td>
            </tr>
            <tr>
              <td className="align-top">karma</td>
              <td>{currentUser.karma}</td>
            </tr>
            <tr>
              <td className="align-top">about:</td>
              <td className="overflow-hidden">
                <textarea
                  className="border border-gray-500 py-px px-0.5"
                  name="about"
                  rows={5}
                  cols={60}
                  defaultValue={currentUser.about ?? ""}
                ></textarea>
                <Link
                  className="text-2xs ml-1"
                  href={"/formatdoc"}
                  tabIndex={-1}
                >
                  help
                </Link>
              </td>
            </tr>
            <tr>
              <td></td>
              <td className="text-xs">
                Only admins see your email below. To share publicly, add to the
                'about' box.
              </td>
            </tr>
            <tr>
              <td>email:</td>
              <td className="align-top">
                <input
                  className="border border-gray-500 py-px px-0.5"
                  type="text"
                  name="email"
                  size={60}
                ></input>
              </td>
            </tr>
            <tr>
              <td></td>
              <td className="text-sm">
                <Link
                  className="underline"
                  href={`/upvoted?id=${currentUser.id}`}
                >
                  upvoted submissions
                </Link>
                {" / "}
                <Link
                  className="underline"
                  href={`/upvoted?id=${currentUser.id}&comments=t`}
                >
                  comments
                </Link>
              </td>
            </tr>
            <tr>
              <td></td>
              <td className="text-sm">
                <Link
                  className="underline"
                  href={`/favorites?id=${currentUser.id}`}
                >
                  favorite submissions
                </Link>
                {" / "}
                <Link
                  className="underline"
                  href={`/favorites?id=${currentUser.id}&comments=t`}
                >
                  comments
                </Link>
                <i>{" (publicly visible)"}</i>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <input
          className="border border-gray-500 bg-gray-200 text-sm py-px px-1.5"
          type="submit"
          value="update"
        ></input>
      </form>
    );
  }

  return (
    <table className="text-sm text-content-gray border-separate">
      <tbody>
        <tr>
          <td className="align-top">user:</td>
          <td>
            <Link href={`/user?id=${displayUser.id}`}>{displayUser.id}</Link>
          </td>
        </tr>
        <tr>
          <td className="align-top">created:</td>
          <td>{formatDateString(displayUser.created)}</td>
        </tr>
        <tr>
          <td className="align-top">karma</td>
          <td>{displayUser.karma}</td>
        </tr>
        <tr>
          <td className="align-top">about:</td>
          <td className="overflow-hidden">{displayUser.about}</td>
        </tr>
        <tr>
          <td></td>
          <td className="text-sm">
            <Link
              className="underline"
              href={`/favorites?id=${displayUser.id}`}
            >
              favorite submissions
            </Link>
            {" / "}
            <Link
              className="underline"
              href={`/favorites?id=${displayUser.id}&comments=t`}
            >
              comments
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
