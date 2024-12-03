import { Tweet } from "@/types/tweets";
import { fetch_to } from "./fetch";
import { User } from "@/types/User";


export async function mappedTwits(data: [], curretUser: User) {
    const uniqueUserIds = Array.from(
        new Set(data.map((tweet: Tweet) => tweet.createdBy))
    );

    const sharedTwit: { [key: string]: any } = {};
    data.forEach((tweet: Tweet) => {
    if (tweet.sharedBy == null) {
        return;
    }
    const resnapeado = tweet.sharedBy == curretUser.id;
    if (resnapeado) {
        sharedTwit[tweet.id] = resnapeado;
    }
    if (!uniqueUserIds.includes(tweet.sharedBy)) {
        uniqueUserIds.push(tweet.sharedBy);
    }
    });

    const uniqueTwitIds = Array.from(
    new Set(
        data
        .filter((tweet: Tweet) => tweet.likesCount != "0")
        .map((tweet: Tweet) => tweet.id)
    )
    );

    const userResponses = await Promise.all(
    uniqueUserIds.map((userId) =>
        fetch_to(`https://api-gateway-ccbe.onrender.com/users/${userId}`, "GET")
    )
    );

    const likesResponses = await Promise.all(
    uniqueTwitIds.map((twitId) =>
        fetch_to(
        `https://api-gateway-ccbe.onrender.com/twits/${twitId}/like`,
        "GET"
        )
    )
    );

    const users = await Promise.all(
    userResponses.filter((res) => res.status === 200).map((res) => res.json())
    );
    const likes = await Promise.all(
    likesResponses
        .filter((res) => res.status === 200)
        .map((res) => res.json())
    );

    const userMap: { [key: string]: any } = {};
    users.forEach((user) => {
    userMap[user.id] = user;
    });

    const userLikes: { [key: string]: any } = {};
    likes.flat().forEach((like) => {
    const megusteado = like.likedBy == curretUser.id;
    if (megusteado) {
        userLikes[like.twitsnapId] = megusteado;
    }
    });

    const mappedTweets = data.map((tweet: Tweet) => {
    const mappedUser = userMap[tweet.createdBy] || {};
    const sharedBy = userMap[tweet.sharedBy] || {};
    const likedByMe = userLikes[tweet.id] || false;
    const sharedByMe = sharedTwit[tweet.id] || false;
    console.log(curretUser);
    const favourite = curretUser.favourites.includes(tweet.id);
    return {
        id: tweet.id,
        avatar: `https://robohash.org/${mappedUser.id}.png`,
        name: mappedUser?.name || "Desconocido",
        username: mappedUser?.user || "unknown",
        message: tweet.message,
        likesCount: tweet.likesCount,
        sharesCount: tweet.sharesCount,
        sharedBy: sharedBy?.user || null,
        repliesCount: tweet.repliesCount,
        createdBy: mappedUser.id,
        likedByMe: likedByMe,
        sharedByMe: sharedByMe,
        parentId: tweet.parentId,
        createdAt: tweet.createdAt,
        favourite: favourite,
    };
    });

    return mappedTweets as Tweet[];
} 