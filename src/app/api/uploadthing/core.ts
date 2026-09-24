import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user) throw new Error("Not signed in");

      const role = (session.user as any).role;
      if (role !== "FARMER" && role !== "ADMIN") {
        throw new Error("Only farmers can upload");
      }

      return {
        userId: (session.user as any).id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        name: file.name,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;