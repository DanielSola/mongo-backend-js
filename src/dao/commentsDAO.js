import { ObjectId } from "bson"

let comments

export default class CommentsDAO {
  static async injectDB(conn) {
    if (comments) {
      return
    }
    try {
      comments = await conn.db(process.env.MFLIX_NS).collection("comments")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async addComment(movieId, user, comment, date) {
    try {
      const commentDoc = {
        name: user.name,
        email: user.email,
        date: date,
        text: comment,
        movie_id: ObjectId(movieId),
      }

      return await comments.insertOne(commentDoc)
    } catch (e) {
      console.error(`Unable to post comment: ${e}`)
      return { error: e }
    }
  }

  static async updateComment(commentId, userEmail, text, date) {
    try {
      const updateResponse = await comments.updateOne(
        { email: userEmail, _id: ObjectId(commentId) },
        { $set: { text, date } },
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update comment: ${e}`)
      return { error: e }
    }
  }

  static async deleteComment(commentId, userEmail) {
    try {
      const deleteResponse = await comments.deleteOne({
        _id: ObjectId(commentId),
        email: userEmail,
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete comment: ${e}`)
      return { error: e }
    }
  }

  static async mostActiveCommenters() {
    /**
    Ticket: User Report

    Build a pipeline that returns the 20 most frequent commenters on the MFlix
    site. You can do this by counting the number of occurrences of a user's
    email in the `comments` collection.
    */
    try {
      // TODO Ticket: User Report
      // Return the 20 users who have commented the most on MFlix.
      const pipeline = []

      // TODO Ticket: User Report
      // Use a more durable Read Concern here to make sure this data is not stale.
      const readConcern = comments.readConcern

      const aggregateResult = await comments.aggregate(pipeline, {
        readConcern,
      })

      return await aggregateResult.toArray()
    } catch (e) {
      console.error(`Unable to retrieve most active commenters: ${e}`)
      return { error: e }
    }
  }
}

/**
 * Success/Error return object
 * @typedef DAOResponse
 * @property {boolean} [success] - Success
 * @property {string} [error] - Error
 */
