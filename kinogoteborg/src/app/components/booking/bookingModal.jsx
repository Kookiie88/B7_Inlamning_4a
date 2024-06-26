"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/components/booking/button";

// first step: login
import BookingLogin from "@/app/components/booking/bookingLogin";
// Steps as a user
import PaymentAsUser from "@/app/components/booking/paymentAsUser";
import EditPaymentAsUser from "@/app/components/booking/editPaymentAsUser";
// Steps as a guest
// import BookingAsGuest from "@/app/components/booking/bookingAsGuest";
import PaymentAsGuest from "@/app/components/booking/paymentOptionAsGuest";
// Endstep validation for all
import BookingControl from "@/app/components/booking/controlOfBooking";
import BookingConfirmation from "@/app/components/booking/bookingConfirmation";
// Check for special needs
import ValidateSpecialNeeds from "@/app/components/booking/validateSpecialNeeds";
import SpecialNeedsLogin from "@/app/components/booking/specialNeedsLogin";

export const ModalHeader = ({ input }) => {
  return (
    <div className="flex justify-center">
      <h2 className="relative text-2xl text-white underline underline-offset-2">{input}</h2>
    </div>
  );
};

export default function BookingModal({
  isModalOpen,
  isLogin,
  isVerified,
  setSpecialNeeds,
  specialNeeds,
  seatsToBook,
  uuid,
  userID,
  session,
  time,
  date,
  movieName,
  setSeatsToBook,
}) {
  const [bookingState, setBookingState] = useState("Login");
  const [guestUser, setGuestUser] = useState();

  if (!seatsToBook) {
    isModalOpen(false);
  }

  if (seatsToBook && seatsToBook.length != 0)
    seatsToBook[0].forEach((seat) => {
      if (seat.includes("_S")) {
        setSpecialNeeds(true);
      } else {
        setSpecialNeeds(false);
      }
    });

  useEffect(() => {
    if (specialNeeds) {
      if (isLogin) {
        if (isVerified) {
          setBookingState("ControlOfBooking");
        } else {
          setBookingState("ValidateSpecialNeeds");
        }
      } else {
        setBookingState("ValidateSpecialNeeds");
      }
    } else {
      if (isLogin) {
        setBookingState("ControlOfBooking");
      } else {
        setBookingState("Login");
      }
    }
  }, [isLogin, specialNeeds, isVerified]);

  return (
    <>
      <div className="relative float-start top-0 left-[90%]">
        <Button
          onClick={() => {
            setBookingState("Login"), isModalOpen(false);
          }}
        >
          X
        </Button>
      </div>

      {bookingState === "Login" ? (
        <BookingLogin setBookingState={setBookingState} isModalOpen={isModalOpen} />
      ) : null}
      {/* 
      OPTIONS FOR USERS
      {bookingState === "PaymentAsUser" ? (
        <PaymentAsUser setBookingState={setBookingState} isModalOpen={isModalOpen} />
      ) : null}

      {bookingState === "EditPaymentAsUser" ? (
        <EditPaymentAsUser setBookingState={setBookingState} isModalOpen={isModalOpen} />
      ) : null} */}

      {/* OPTIONS FOR GUESTS */}

      {bookingState === "PaymentAsGuest" ? (
        <PaymentAsGuest
          setBookingState={setBookingState}
          isModalOpen={isModalOpen}
          setGuestUser={setGuestUser}
        />
      ) : null}

      {/* ENDSTEP OF BOOKING  */}
      {bookingState === "ControlOfBooking" ? (
        <BookingControl
          setBookingState={setBookingState}
          isModalOpen={isModalOpen}
          seatsToBook={seatsToBook}
          time={time}
          date={date}
          movieName={movieName}
          session={session}
          guestUser={guestUser}
          uuid={uuid}
          setSeatsToBook={setSeatsToBook}
        />
      ) : null}

      {bookingState === "ConfirmationOfBooking" ? (
        <BookingConfirmation
          setBookingState={setBookingState}
          isModalOpen={isModalOpen}
          isLogin={isLogin}
          seatsToBook={seatsToBook}
          time={time}
          date={date}
          movieName={movieName}
          session={session}
          setSeatsToBook={setSeatsToBook}
        />
      ) : null}

      {bookingState === "ValidateSpecialNeeds" ? (
        <ValidateSpecialNeeds setBookingState={setBookingState} isModalOpen={isModalOpen} />
      ) : null}

      {bookingState === "specialkNeedsLogin" ? (
        <SpecialNeedsLogin setBookingState={setBookingState} isModalOpen={isModalOpen} />
      ) : null}
    </>
  );
}
