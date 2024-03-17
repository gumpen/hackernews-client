import { CommentTree } from "@/components/comment-tree";
import { getCurrentUser } from "@/lib/api";
import { itemService } from "@/server/service";
import { notFound } from "next/navigation";
import { z } from "zod";
import { THREAD_NUM_PER_PAGE } from "@/lib/constants";
import { MoreTextButton } from "@/components/more-text-button";

export default async function ThreadsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const userIdSchema = z.string().min(1).optional();
  const parseResult = userIdSchema.safeParse(searchParams["id"]);
  if (!parseResult.success) {
    notFound();
  }

  const user = await getCurrentUser();

  let displayUserId: string;
  if (parseResult.data) {
    displayUserId = parseResult.data;
  } else if (user) {
    displayUserId = user.id;
  } else {
    notFound();
  }

  const pageSchema = z.coerce.number().min(1);
  const pageSchemaResult = pageSchema.safeParse(searchParams["p"]);
  let pageNumber = 1;
  if (pageSchemaResult.success) {
    pageNumber = pageSchemaResult.data;
  }

  const threads = await itemService.getUserThreads(
    displayUserId,
    pageNumber,
    THREAD_NUM_PER_PAGE
  );

  const renderTrees = () => {
    return threads.map(({ story, threadRootCommentId, comments }) => {
      return (
        <CommentTree
          key={threadRootCommentId}
          items={comments}
          story={story}
          user={user}
          rootCommentId={threadRootCommentId}
        ></CommentTree>
      );
    });
  };

  return (
    <>
      {renderTrees()}
      <div className="pl-5">
        <MoreTextButton></MoreTextButton>
      </div>
    </>
  );
}
