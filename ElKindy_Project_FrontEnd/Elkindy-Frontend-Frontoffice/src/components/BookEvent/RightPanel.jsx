import React, { useState, useEffect } from 'react';
import JsBarcode from "jsbarcode";
import { getEventById } from "../../services/eventsApi";
import { getEventTickets } from "../../services/eventsApi";
import { updateEvent } from "../../services/eventsApi";
import { addTickets } from "../../services/ticketsApi";
import { useParams } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'

import axios from "axios";


//rightpanel

const RightPanel = () => {
    const [eventDetails, setEventDetails] = useState(null);
    const { eventId } = useParams();
    const [mainDate, setMainDate] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [movieData, setMovieData] = useState([]);
    const [eventTickets, setEventTickets] = useState(0);
    const [userId, setUserId] = useState(null);
    
  
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const storedToken = Cookies.get('token');
            const storedRefreshToken = Cookies.get('refreshToken');
            const decodedToken = jwtDecode(storedToken);
            const { userId, role } = decodedToken;
    
            const response = await axios.get(`http://localhost:9090/api/auth/user/${userId}`);
            setUser(response.data);
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
        fetchUserData();
      }, []);
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });

    useEffect(() => {
        const getUserIdFromToken = () => {
            const storedToken = Cookies.get('token');
            if (storedToken) {
                const decodedToken = jwtDecode(storedToken);
                const userId = decodedToken.userId;
                setUserId(userId);
                
            }
        };

        getUserIdFromToken();
    }, []);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const eventData = await getEventById(eventId);
                setEventDetails(eventData);
                setMainDate(new Date(eventData.startDate).getDate());
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        fetchEventDetails();
    }, [eventId]);


    useEffect(() => {
        if (eventDetails) {
            const filteredData = eventDetails.series ? [eventDetails] : [];
            setMovieData(filteredData);
        }
    }, [eventDetails]);
    useEffect(() => {
        async function fetchTickets() {
            try {
                const tickets = await getEventTickets(eventId);
                setEventTickets(tickets);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        }
        fetchTickets();
    }, [eventId]);

    const handleBookTicketClick = () => {
        // Vider les anciens tickets avant de commencer le traitement des sièges sélectionnés
        document.getElementById('ticket').innerHTML = '';
        const selectedSeats = document.getElementsByClassName('selected');
        Array.from(selectedSeats).forEach((el) => {
            const seatNo = parseInt(el.getAttribute('book')) + 1;
            // const seatSr = el.getAttribute('sr').toLowerCase();
            const seatSr = el.getAttribute('sr');
            // const seatPrice = el.innerText;
            const seatPrice = eventDetails.price;
            // Vérifiez si eventDetails est défini
            if (eventDetails) {
                // Copiez l'objet pour éviter de modifier les données originales
                const updatedEventData = { ...eventDetails };
                // Vérifiez si la propriété seatSr existe dans les données de l'événement
                if (updatedEventData.hasOwnProperty(seatSr)) {
                    // Vérifiez si la propriété seatSr est un tableau
                    if (Array.isArray(updatedEventData[seatSr])) {
                        // Mettez à jour les sièges réservés dans les données de l'événement
                        updatedEventData[seatSr].push(+seatNo);
                        // Mettez à jour les données de l'événement dans le state
                        setEventDetails(updatedEventData);
                    } else {
                        // Si la propriété seatSr n'est pas un tableau, initialisez-la en tant que tableau
                        updatedEventData[seatSr] = [+seatNo];
                        // Mettez à jour les données de l'événement dans le state
                        setEventDetails(updatedEventData);
                    }
                }
            }
            document.getElementById('chair').innerHTML = ''; // Ajoutez cette ligne pour vider les sièges existants

            // const data = PvrData.filter((obj) => obj.date === mainDate && obj.movie === window.location.href.split('?')[1]);
            // addSeats(data);

            document.getElementById('screen').style.display = 'none';
            document.getElementById('chair').style.display = 'none';
            document.getElementById('det').style.display = 'none';
            document.getElementById('book_ticket').style.display = 'none';
            document.getElementById('confirm_booking').style.display = 'unset';
            document.getElementById('confirm_booking').style.marginleft = '100px';
            document.getElementById('back_ticket').style.display = 'unset';
            document.getElementById('back_ticket').style.marginRight = '100px';
            document.getElementById('ticket').style.display = 'block';
            // setSelectedSeats([seatSr+seatNo]);
            setSelectedSeats(prevSelectedSeats => [...prevSelectedSeats, seatSr + seatNo + '-']);


            const ticketDiv = document.createElement('div');
            ticketDiv.className = 'tic';
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                return date.toLocaleDateString('fr-FR', options);
            };
            const extractTime = (dateString) => {
                const date = new Date(dateString);
                const hours = date.getHours();
                const minutes = date.getMinutes();
                return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
            };

            ticketDiv.innerHTML = `
                            <div class="barcode">
                                <div class="card1">
                                    <h6>ROW ${seatSr.toLocaleLowerCase()}</h6>
                                    
                                    <h6>${formatDate(eventDetails.startDate)}</h6>

                                </div>
                                <div class="card1">
                                    <h6>Seat ${seatNo}</h6>
                                    <h6>${extractTime(eventDetails.startDate)}</h6>
                                </div>
        
                                <svg id="${seatSr}${seatNo}barcode"></svg>
                                <h5>VEGUS CINEMA</h5>
                            </div>
                            <div class="tic_details" style="background: url(${eventDetails.imageUrl}) no-repeat center/cover;">
                                <div class="type">Ticket</div>
                                <h5 class="pvr"><span>El</span>Kindy</h5>
                                <h1>${eventDetails.name}</h1>
                                <div class="seat_det">
                                    <div class="seat_cr">
                                        <h6 class="h6-custom">ROW</h6>
                                        <h6 class="h6-custom">${seatSr.toLocaleUpperCase()}</h6>
                                    </div>
                                    <div class="seat_cr">
                                        <h6 class="h6-custom">SEAT</h6>
                                        <h6 class="h6-custom">${seatNo}</h6>
                                    </div>
                                    <div class="seat_cr">
                                        <h6 class="h6-custom">DATE</h6>
                                        <h6 class="h6-custom">${formatDate(eventDetails.startDate)}</h6>
                                    </div>
                                    <div class="seat_cr">
                                        <h6 class="h6-custom">TIME</h6>
                                        <h6 class="h6-custom">${extractTime(eventDetails.startDate)}</h6>
                                    </div>
                                </div>
                            </div>        `;
            document.getElementById('ticket').appendChild(ticketDiv);
            JsBarcode(`#${seatSr}${seatNo}barcode`, `619${seatSr.toUpperCase()}${seatNo}${seatPrice}${mainDate}`);

        });
    };

    const handleBackTicketClick = () => {
        // document.getElementById('chair').innerHTML = ''; // Ajoutez cette ligne pour vider les sièges existants
        document.getElementById('ticket').innerHTML = '';

        document.getElementById('screen').style.display = 'inline-block';
        document.getElementById('chair').style.display = 'block';
        document.getElementById('det').style.display = 'flex';
        document.getElementById('book_ticket').style.display = 'unset';
        document.getElementById('confirm_booking').style.display = 'none';
        document.getElementById('back_ticket').style.display = 'none';
        document.getElementById('ticket').style.display = 'none';
        setSelectedSeats([]);
        document.getElementById('chair').innerHTML = ''; // Ajoutez cette ligne pour vider les sièges existants

    };
    const sendMail = async () => {
        try {
            const response = await axios.post("http://localhost:9090/tickets/sendMail", {
                email: user.email,
                username: user.username
            });
            if (response.data) {
                return response.data;
            }
        } catch (error) {
            console.error('Error sending mail:', error);
            throw error;
        }
    };
  
    const handleConfirmReservation = async () => {
        try {
            // Calculer le prix total en multipliant le prix de l'événement par le nombre de sièges sélectionnés
            const totalPrice = eventDetails.price * selectedSeats.length;

            // Mettre à jour la capacité de la salle en soustrayant le nombre de sièges sélectionnés
            const updatedRoomCapacity = eventDetails.room_capacity - selectedSeats.length;

            // Obtenir la date actuelle
            const currentDate = new Date();

            if (totalPrice > 0) {
                // Afficher une alerte avec les boutons de Bootstrap pour confirmer la réservation
                const result = await swalWithBootstrapButtons.fire({
                    title: "Do you want to confirm the reservation?",
                    text: "If you have confirmed, you will be redirected to the payment page.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No, Cancel",
                    reverseButtons: true
                });

                if (result.isConfirmed) {
                    // Mettre à jour l'événement dans la base de données en utilisant l'API updateEvent
                    await updateEvent(eventDetails._id, { room_capacity: updatedRoomCapacity });

                    // Maintenant, vous pouvez ajouter les billets comme vous le faisiez auparavant
                    const ticketResponse = await addTickets({
                        event: eventDetails._id, // L'ID de l'événement
                        user: userId, // L'ID de l'utilisateur
                        price: totalPrice, // Le prix total des billets
                        selectedSeats: selectedSeats, // Les sièges sélectionnés
                        date: currentDate // Date actuelle
                    });
                    sendMail()
                    // Si la réservation des billets est réussie, procéder au paiement
                    console.log('Billets ajoutés:', ticketResponse);
                    console.log('Utilisateur:', userId);

                    // Effectuer le paiement via une requête POST axios
                    await axios.post("http://localhost:9090/tickets/payement", { amount: totalPrice*1000 })
                        .then((res) => {
                            const { result } = res.data;
                            window.location.href = result.link;
                            console.log(res.data);
                        })
                        .catch((err) => console.error(err));

                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // L'utilisateur a annulé la réservation
                    swalWithBootstrapButtons.fire({
                        title: "Cancelled",
                        text: "Your reservation has been cancelled.",
                        icon: "error"
                    }).then(() => {
                        // Redirection vers une autre page après que l'utilisateur a annulé la réservation
                        window.location.href = `/events/${eventDetails._id}/${eventDetails.movieParam}/bookTickets`;
                    });
                }
            } else {
                const result = await swalWithBootstrapButtons.fire({
                    title: "Do you want to confirm the reservation?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No, Cancel",
                    reverseButtons: true
                });
                if (result.isConfirmed) {
                    // Si le prix total est égal à 0, pas besoin de paiement
                    // Mettre à jour l'événement dans la base de données en utilisant l'API updateEvent
                    await updateEvent(eventDetails._id, { room_capacity: updatedRoomCapacity });

                    // Ajouter les billets comme vous le faisiez auparavant
                    const ticketResponse = await addTickets({
                        event: eventDetails._id,
                        user: userId,
                        price: totalPrice,
                        selectedSeats: selectedSeats,
                        date: currentDate
                    });
                    sendMail()
                    window.location.href = `/events/${eventDetails._id}/${eventDetails.movieParam}/bookTickets`;

                    // Si la réservation des billets est réussie
                    console.log('Billets ajoutés:', ticketResponse);
                    console.log('Utilisateur:', userId);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // L'utilisateur a annulé la réservation
                    swalWithBootstrapButtons.fire({
                        title: "Cancelled",
                        text: "Your reservation has been cancelled.",
                        icon: "error"
                    }).then(() => {
                        // Redirection vers une autre page après que l'utilisateur a annulé la réservation
                        window.location.href = `/events/${eventDetails._id}/${eventDetails.movieParam}/bookTickets`;
                    });
                }
            }

        } catch (error) {
            console.error('Error confirming reservation:', error);
            // Gérer les erreurs de confirmation de la réservation
            swalWithBootstrapButtons.fire({
                title: "An error occurred while confirming your reservation. Please try again later.",
                icon: "error"
            });
        }
    };
  

    const addSeats = (arr) => {
        arr.forEach((el) => {
            const { series, seat } = el;
            console.log('EventTickets', eventTickets);
            console.log(typeof series, "seriestype")
            if (Array.isArray(eventTickets) ) {
                if (Array.isArray(series)) {
                    series.forEach((subSeries) => {
                        let seriesArray = subSeries.split('-');
                        seriesArray.forEach((character) => {
                            let row_book = document.createElement('div');
                            row_book.className = 'row_book';

                            for (let seats = 0; seats < seat; seats++) {
                                if (seats === 0) {
                                    let span = document.createElement('span');
                                    span.innerText = character;
                                    row_book.appendChild(span);
                                }
                                let li = document.createElement('li');
                                let seatId = character + (seats + 1) + '-';
                                console.log(seatId, 'seatId')
                                let isBooked = eventTickets.some(ticket => ticket.selectedSeats.includes(seatId));
                                console.log('isBooked', isBooked)
                                li.className = isBooked ? 'seat booked' : 'seat';
                                li.id = seatId;
                                li.setAttribute('book', seats);
                                li.setAttribute('sr', character);
                                li.innerText = seats + 1;

                                li.onclick = () => {
                                    if (li.className === 'seat booked') {
                                        li.classList.remove('selected');
                                    } else {
                                        li.classList.toggle('selected');
                                    }

                                    let len = Array.from(document.getElementsByClassName('selected')).length;
                                    document.getElementById('book_ticket').style.display = len > 0 ? 'unset' : 'none';
                                };

                                row_book.appendChild(li);

                                if (seats === seat - 1) {
                                    let span = document.createElement('span');
                                    span.innerText = character;
                                    row_book.appendChild(span);
                                }
                            }
                            document.getElementById('chair').appendChild(row_book);
                        });
                    });

                }
            } else {
                console.log("eventTickets is null or undefined.");
            }
        });
    };


    return (
        <div className="right" >
            <div className="screen" id="screen" >
                The Scene
            </div>
            <div className="chair" id="chair">
                {/* Afficher les sièges ici */}
                {addSeats(movieData)}
            </div>
            <div className="ticket" id="ticket">
                {/* Les billets seront affichés ici */}
            </div>
            <div className="details" id="det">
                <div className="details_chair">
                    <li>Available</li>
                    <li>Booked</li>
                    <li>Selected</li>
                </div>
            </div>
            <button className="book_tic" id="book_ticket" onClick={handleBookTicketClick}>
                <i className="bi bi-arrow-right-short"></i>
            </button>
            <button className="book_tic" id="back_ticket" onClick={handleBackTicketClick}>
                <i className="bi bi-arrow-left-short"></i>
            </button>
            <button className="book_tic" id="confirm_booking" onClick={handleConfirmReservation}>
                <i className="bi bi-arrow-right-short"></i>
            </button>
        </div>
    );
};

export default RightPanel;
