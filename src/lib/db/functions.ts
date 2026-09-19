import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth.server";

import { db } from "./index.server";
import { blogPosts, faqs, products, users } from "./schema";

export const getProducts = createServerFn({ method: "GET" }).handler(
  async () => {
    const items = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt));
    return { products: items };
  },
);

export const getHomeFaqs = createServerFn({ method: "GET" }).handler(
  async () => {
    const items = await db
      .select()
      .from(faqs)
      .orderBy(desc(faqs.createdAt))
      .limit(7);
    return { faqs: items };
  },
);

export const getAllFaqs = createServerFn({ method: "GET" }).handler(
  async () => {
    const items = await db.select().from(faqs);
    return { faqs: items };
  },
);

export const deleteFaq = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await db.delete(faqs).where(eq(faqs.id, id));
  });

export const addFaq = createServerFn({ method: "POST" })
  .validator((data: { question: string; answer: string }) => data)
  .handler(async ({ data }) => {
    await db.insert(faqs).values(data);
  });

export const getPublishedPosts = createServerFn({ method: "GET" }).handler(
  async () => {
    const posts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        createdAt: blogPosts.createdAt,
        authorName: users.name,
      })
      .from(blogPosts)
      .innerJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));
    return { posts };
  },
);

export const getPostById = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const [post] = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        content: blogPosts.content,
        excerpt: blogPosts.excerpt,
        createdAt: blogPosts.createdAt,
        authorName: users.name,
      })
      .from(blogPosts)
      .innerJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.id, id));

    return { post: post ?? null };
  });

export const getAdminStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const [faqCount] = await db.select({ count: faqs.id }).from(faqs);
    const [postCount] = await db
      .select({ count: blogPosts.id })
      .from(blogPosts);
    const [userCount] = await db.select({ count: users.id }).from(users);
    return {
      faqCount: Number(faqCount?.count ?? 0),
      postCount: Number(postCount?.count ?? 0),
      userCount: Number(userCount?.count ?? 0),
    };
  },
);

export const getAllBlogPosts = createServerFn({ method: "GET" }).handler(
  async () => {
    const posts = await db.select().from(blogPosts);
    return { posts };
  },
);

export const deletePost = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  });

export const createPost = createServerFn({ method: "POST" })
  .validator(
    (data: { title: string; slug: string; excerpt: string; content: string }) =>
      data,
  )
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });
    if (!session) throw new Error("Unauthorized");
    await db.insert(blogPosts).values({
      ...data,
      authorId: session.user.id,
      published: true,
    });
  });

export const getAllUsers = createServerFn({ method: "GET" }).handler(
  async () => {
    const accounts = await db.select().from(users);
    return { accounts };
  },
);

export const setRole = createServerFn({ method: "POST" })
  .validator((data: { userId: string; role: string }) => data)
  .handler(async ({ data }) => {
    await db
      .update(users)
      .set({ role: data.role })
      .where(eq(users.id, data.userId));
  });

// ---------------------------------------------------------------------------
// User profile
// ---------------------------------------------------------------------------

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });
    if (!session) return { user: null };

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
        displayUsername: users.displayUsername,
        image: users.image,
        role: users.role,
        bio: users.bio,
        website: users.website,
        location: users.location,
        birthday: users.birthday,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.user.id));

    return { user: user ?? null };
  },
);

export const updateProfile = createServerFn({ method: "POST" })
  .validator(
    (data: {
      name?: string;
      bio?: string;
      website?: string;
      location?: string;
      image?: string;
      birthday?: Date | null;
    }) => data,
  )
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });
    if (!session) throw new Error("Unauthorized");

    await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, session.user.id));
  });
