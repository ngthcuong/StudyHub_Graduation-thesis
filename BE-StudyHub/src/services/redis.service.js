const redis = require("redis");
const config = require("../configs/config");

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = redis.createClient({
        url: config.redisUrl,
        retry_strategy: (options) => {
          if (options.error && options.error.code === "ECONNREFUSED") {
            return new Error("The server refused the connection");
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error("Retry time exhausted");
          }
          if (options.attempt > 10) {
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        },
      });

      this.client.on("error", (err) => {
        console.error("Redis Client Error: ", err);
        this.connect = false;
      });

      this.client.on("connect", () => {
        console.log("Redis connected successfully!");
        this.connect = true;
      });

      this.client.on("ready", () => {
        console.log("Redis ready to use");
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      console.error("Redis connection failed: ", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.client) {
        await this.client.quit();
        this.isConnected = false;
        console.log("Redis disconnected");
      }
    } catch (error) {
      console.error("Error disconnecting Redis:", error);
    }
  }

  async saveToken({ userId, token, expiresIn = 3600 }) {
    try {
      if (!this.isConnected) {
        throw new Error("Redis not connected");
      }

      const key = `token:${userId}:${token}`;
      await this.client.setEx(
        key,
        expiresIn,
        JSON.stringify({
          userId,
          token,
          createdAt: new Date().toISOString,
          expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString,
        })
      );

      await this.client.sAdd(`user_token:${userId}`, token);
      console.log(`Token saved for user ${userId}`);
      return true;
    } catch (error) {
      console.error("Error saving token: ", error);
      return false;
    }
  }

  async isValidToken({ userId, token }) {
    try {
      if (!this.isConnected) {
        return false;
      }

      const key = `token:${userId}:${token}`;
      const tokenData = await this.client.get(key);

      if (!tokenData) {
        return false;
      }

      const parsedToken = JSON.parse(tokenData);
      const now = new Date();
      const expiresAt = new Date(parsedToken.expiresAt);

      if (now > expiresAt) {
        await this.removeToken({ userId, token });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking token validity:", error);
      return false;
    }
  }

  async removeToken({ userId, token }) {
    try {
      if (!this.isConnected) {
        return false;
      }

      const key = `token:${userId}:${token}`;
      await this.client.del(key);

      // Xóa khỏi danh sách tokens của user
      await this.client.sRem(`user_tokens:${userId}`, token);
      console.log(`Token removed for user ${userId}`);
      return true;
    } catch (error) {
      console.error("Error removing token: ", error);
      return false;
    }
  }

  async removeAllUserTokens(userId) {
    try {
      if (!this.isConnected) {
        return false;
      }

      const userTokens = await this.client.sMembers(`user_tokens:${userId}`);

      for (const token of userTokens) {
        const key = `token:${userId}:${token}`;
        await this.client.del(key);
      }

      await this.client.del(`user_tokens:${userId}`);

      console.log(`All tokens removed for user ${userId}`);
      return true;
    } catch (error) {
      console.error("Error removing all user tokens:", error);
      return false;
    }
  }

  async getTokenInfo({ userId, token }) {
    try {
      if (!this.isConnected) {
        return null;
      }

      const key = `token:${userId}:${token}`;
      const tokenData = await this.client.get(key);

      if (!tokenData) {
        return null;
      }

      return JSON.parse(tokenData);
    } catch (error) {
      console.error("Error getting token info:", error);
      return null;
    }
  }

  async getUserActiveSessions(userId) {
    try {
      if (!this.isConnected) {
        return 0;
      }

      const userTokens = await this.client.sMembers(`user_tokens:${userId}`);
      return userTokens.length;
    } catch (error) {
      console.error("Error getting user active sessions:", error);
      return 0;
    }
  }

  async cleanupExpiredTokens() {
    try {
      if (!this.isConnected) {
        return;
      }

      const keys = await this.client.keys("token:*");
      const now = new Date();

      for (const key of keys) {
        const tokenData = await this.client.get(key);
        if (tokenData) {
          const parsedToken = JSON.parse(tokenData);
          const expiresAt = new Date(parsedToken.expiresAt);

          if (now > expiresAt) {
            await this.client.del(key);
            await this.client.sRem(
              `user_tokens:${parsedToken.userId}`,
              parsedToken.token
            );
          }
        }
      }

      console.log("Cleanup expired tokens completed");
    } catch (error) {
      console.error("Error cleaning up expired tokens:", error);
    }
  }
}

const redisService = new RedisService();
module.exports = redisService;
