class ApiConstants {
    LOGIN = "/login";
    REGISTER = "/register";
    VALIDATE_EMAIL = "/validateemail";

    MY_BOOKINGS = "/mybookings";
    CHECK_AVAILABILITY_TIME_SLOTS = "/checkAvailability";
    BOOKINGS = "/";
    ONE_BOOKING = "/:id";
}

module.exports = new ApiConstants()
