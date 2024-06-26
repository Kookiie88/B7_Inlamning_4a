"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/booking/button";
import { RenderSaloon } from "../../components/booking/RenderSaloon";
import BookingModal from "@/app/components/booking/bookingModal";
import { postSeats, putSeats } from "@/scripts/fetchSeatsToBook";
import { NoSeats } from "@/app/components/booking/NoSeats";
import MovieDetails from "@/app/components/booking/movieDetails";
import ScreeningDates from "@/app/components/booking/screeningDates";
import ScreeningTimes from "@/app/components/booking/screeningTimes";
import { Loading } from "@/app/components/booking/loading";
import AmountOfGuests from "@/app/components/booking/amountOfGuests";

const Modal = ({
  isModalOpen,
  isLogin,
  isVerified,
  setSpecialNeeds,
  specialNeeds,
  seatsToBook,
  uuid,
  userID,
  session,
  movieName,
  selectedDate,
  selectedTime,
  setSeatsToBook,
}) => {
  return (
    <div className="fixed z-10 inset-0 overflow-hidden flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col items-center justify-center w-full max-w-screen-lg mx-auto px-4 py-8">
        <div className="bg-[#7E6969] text-white rounded-lg shadow-lg p-6 w-[96v] md:min-w-[30vw] md:w-fit ">
          <BookingModal
            isModalOpen={isModalOpen}
            isLogin={isLogin}
            isVerified={isVerified}
            setSpecialNeeds={setSpecialNeeds}
            specialNeeds={specialNeeds}
            seatsToBook={seatsToBook}
            uuid={uuid}
            userID={userID}
            session={session}
            movieName={movieName}
            time={selectedTime}
            date={selectedDate}
            setSeatsToBook={setSeatsToBook}
          />
        </div>
      </div>
    </div>
  );
};

export default function Page({ params }) {
  const [bookNow, setBookNow] = useState(false);
  const [seats, setSeats] = useState(2);
  const [isVerified, setIsVerified] = useState(false);
  const [specialNeeds, setSpecialNeeds] = useState(false);
  const [seatsToBook, setSeatsToBook] = useState();
  const [isLogin, setIsLogin] = useState(null);
  const [isAllowToBook, setIsAllowToBook] = useState(false);
  const [noSeatsBooked, setNoSeatsBooked] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [uuid, setUuid] = useState(null);
  const [oldSeats, setOldSeats] = useState(null);
  const [movieName, setMovieName] = useState();
  const movieID = params.movieID;
  let userID;

  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {},
  });

  useEffect(() => {
    if (status === "authenticated") {
      setIsLogin(true);
      userID = session?.user?.id;
    } else {
      setIsLogin(false);
    }
  }, [status]);

  const [response, setResponse] = useState([]);

  useEffect(() => {
    if (seatsToBook && seatsToBook.length > 0) {
      const handleSeats = async () => {
        try {
          if (!uuid) {
            const data = await postSeats(
              movieID,
              seatsToBook[0],
              selectedDate,
              selectedTime,
              session?.user?.id,
            );
            // console.log('movie ',movieID,'seats ', seatsToBook[0], 'time ',  selectedTime,'date ', selectedDate, 'session ', session?.user?.id);
            setResponse(data);
            setUuid(data.uuid);
            setOldSeats(true);
            setIsAllowToBook(true);
          } else if (uuid) {
            putSeats(seatsToBook[0], uuid);
          }
        } catch (error) {
          console.error("Error while handling seats:", error);
        }
      };
      handleSeats();
    }
  }, [seatsToBook]);

  return (
    <div className="flex flex-col h-screen w-[80vw] m-auto mb-8">
      <div className="grid md:grid-cols-4 md:grid-rows-8 gap-4">
        <div className="md:row-span-6 md:col-start-4 md:row-start-1 border h-fit">
          <MovieDetails movieID={movieID} setMovieName={setMovieName} />
        </div>

        <div className="md:col-span-3 flex flex-row align-center justify-center border p-2 ">
          <ScreeningDates
            movieID={movieID}
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>

        <div className="md:col-span-2 md:col-start-1 md:row-start-2 flex flex-row align-center justify-evenly p-2 border">
          <ScreeningTimes
            movieID={movieID}
            setSelectedTime={setSelectedTime}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
          />
        </div>

        <div className="md:col-start-3 md:col-start-3 md:row-start-2 flex flex-row align-center justify-evenly p-2 border">
          <AmountOfGuests
            seats={seats}
            setSeats={setSeats}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
          />
        </div>

        <div className="flex flex-col md:col-span-3 md:row-span-6 md:col-start-1 md:row-start-3 border items-center m-0">
          <div id="movieScreen" className="h-2 w-full bg-black col-start-1 rounded-md border"></div>
          <Suspense fallback={<Loading />}>
            <RenderSaloon
              saloonNumber={2}
              seats={seats}
              setSeatsToBook={setSeatsToBook}
              seatsToBook={seatsToBook}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              userID={session?.user?.id}
              movieID={movieID}
            />
          </Suspense>
        </div>

        <div className="md:col-start-4 md:row-start-8 border justify-center items-center grid">
          {!noSeatsBooked && (
            <Button
              onClick={() => {
                if (isAllowToBook) {
                  setBookNow(true);
                } else {
                  setNoSeatsBooked(true);
                  setTimeout(() => {
                    setNoSeatsBooked(false);
                  }, 2000);
                }
              }}
              className={"w-[10em]"}
            >
              Book Now
            </Button>
          )}
          {noSeatsBooked && <NoSeats />}
        </div>
      </div>

      {/* Opens the booking modal when isModalOpen = true. */}
      {bookNow && (
        <Modal
          isModalOpen={setBookNow}
          isLogin={isLogin}
          isVerified={isVerified}
          setSpecialNeeds={setSpecialNeeds}
          specialNeeds={specialNeeds}
          seatsToBook={seatsToBook}
          uuid={uuid}
          userID={userID}
          session={session}
          selectedTime={selectedTime}
          selectedDate={selectedDate}
          movieName={movieName}
          setSeatsToBook={setSeatsToBook}
        />
      )}
    </div>
  );
}
