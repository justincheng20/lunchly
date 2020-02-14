/** Reservation for Lunchly */

const moment = require("moment");
const ExpressError = require("../expressError")
const db = require("../db");


/** A reservation for a party */

class Reservation {
  constructor({id, customerId, numGuests, startAt, notes}) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  /** formatter for startAt */

  getformattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
          `SELECT id,
           customer_id AS "customerId",
           num_guests AS "numGuests",
           start_at AS "startAt",
           notes AS "notes"
         FROM reservations
         WHERE customer_id = $1`,
        [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }

  async save(){
    const result = await db.query(
      `INSERT INTO reservations (customer_id, num_guests, start_at, notes)
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
        [this.customerId, this.numGuests, this.startAt, this.notes]
    );
    this.id = result.rows[0].id;
  }

  set numGuests(val) {
    if (val < 1) {
      throw new ExpressError ("Reservation must be for at least one person.", 400)
    } else {
    this._numGuests = val
    }
  }

  get numGuests() {
    return this._numGuests;
  }



}


module.exports = Reservation;
