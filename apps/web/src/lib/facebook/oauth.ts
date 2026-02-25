const GRAPH_API_VERSION = "v22.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

const SCOPES = "pages_manage_posts,pages_read_engagement";

interface FacebookUser {
  id: string;
  name: string;
}

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
}

interface PagesResponse {
  data: FacebookPage[];
  paging?: { cursors: { after: string }; next?: string };
}

export function getFacebookAuthUrl(state: string): string {
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`;
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: redirectUri,
    scope: SCOPES,
    response_type: "code",
    state,
  });
  return `https://www.facebook.com/${GRAPH_API_VERSION}/dialog/oauth?${params}`;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`;
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    redirect_uri: redirectUri,
    code,
  });

  const res = await fetch(`${GRAPH_BASE}/oauth/access_token?${params}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to exchange code for token");
  }
  const data = await res.json();
  return data.access_token as string;
}

export async function exchangeForLongLivedToken(shortToken: string): Promise<{ token: string; expiresIn: number }> {
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    fb_exchange_token: shortToken,
  });

  const res = await fetch(`${GRAPH_BASE}/oauth/access_token?${params}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to exchange for long-lived token");
  }
  const data = await res.json();
  return {
    token: data.access_token as string,
    expiresIn: data.expires_in as number,
  };
}

export async function getUserInfo(token: string): Promise<FacebookUser> {
  const res = await fetch(`${GRAPH_BASE}/me?fields=id,name&access_token=${token}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to fetch user info");
  }
  return res.json();
}

export async function getAllPages(userToken: string): Promise<FacebookPage[]> {
  const pages: FacebookPage[] = [];
  let url: string | null = `${GRAPH_BASE}/me/accounts?fields=id,name,access_token,category&access_token=${userToken}&limit=100`;

  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Failed to fetch pages");
    }
    const data: PagesResponse = await res.json();
    pages.push(...data.data);
    url = data.paging?.next || null;
  }

  return pages;
}
