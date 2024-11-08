import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

function FOIRequestCard({ request, processingDays }) {
	const [countdown, setCountdown] = useState(null);
	const [requestStage, setRequestStage] = useState(request.stage);

	const [timeExpired, setTimeExpired] = useState(false);

	useEffect(() => {
		const updateStage = async () => {
			try {
				const { data, error } = await supabase.from("requests").update({ stage: "Not Responded" }).eq("id", request.id);

				if (error) {
					console.error("Error updating request stage:", error);
					// You might want to handle the error more gracefully, e.g.,
					// display an error message to the user
				} else {
					console.log("Request stage updated successfully");
					setRequestStage("Not Responded");
					// You could potentially refetch the updated request data here
				}
			} catch (error) {
				console.error("Unexpected error updating stage:", error);
			}
		};

		// Regular countdown while time remaining
		const calculateCountDown = (timeRemaining) => {
			const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
			const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

			setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
		};

		// Counting up since expiry
		const calculateCountUp = (timeRemaining) => {
			const timeSinceExpiry = Math.abs(timeRemaining); // Get positive time difference
			const days = Math.floor(timeSinceExpiry / (1000 * 60 * 60 * 24));
			const hours = Math.floor((timeSinceExpiry % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((timeSinceExpiry % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((timeSinceExpiry % (1000 * 60)) / 1000);

			setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
		};

		const calculateCounter = () => {
			if (requestStage === "Processing" || requestStage === "Not Responded") {
				// 1. Convert the processing date
				const processingDate = new Date(request.processing_date);

				// 2. Calculate the deadline
				const deadline = processingDate.setDate(processingDate.getDate() + processingDays);

				// 3. Calculate the time remaining until the deadline
				const now = Date.now();
				let timeRemaining = deadline - now;

				// 4. Check if the deadline has passed and update the stage & countdown
				if (timeRemaining < 0) {
					setTimeExpired(true);
					calculateCountUp(timeRemaining);
					if (requestStage === "Processing") {
						updateStage();
					}
					return;
				}

				calculateCountDown(timeRemaining);
			}
		};

		calculateCounter();

		// Set an interval to recalculate the countdown every second
		const intervalId = setInterval(calculateCounter, 1000);

		// Cleanup: Clear the interval when the component unmounts or stage changes
		return () => clearInterval(intervalId);
	}, [timeExpired]);

	return (
		<>
			{(requestStage === "Processing" || requestStage === "Not Responded" || requestStage === "Responded") && (
				<>
					<div className="max-w-md rounded overflow-hidden shadow-lg flex flex-col justify-between mx-2 my-12">
						<div className="">
							{request.organisation_id ? (
								<Image
									src={request.organisation_id.thumbnail_url}
									height="1000"
									width="1000"
									className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
									alt={request.organisation_id.name || "Thumbnail"}
									priority="high"
								/>
							) : null}
							<div className="px-6 py-4">
								<div className="font-semibold text-lg mb-2">{request.subject}</div>
								<div className="text-gray-700 text-base">
									<p
										className={`my-2 py-1 ${requestStage === "Processing"
											? "text-processing"
											: requestStage === "Not Responded"
												? "text-notresponded"
												: "text-responded"
											}`}
									>
										Status: {requestStage}
									</p>
								</div>
							</div>
						</div>

						<div className="text-gray-100 text-base">
							{countdown && (
								<div
									className={`text-center py-4 ${requestStage === "Processing" ? "bg-processing" : requestStage === "Not Responded" ? "bg-notresponded" : "bg-responded"
										}`}
								>
									{countdown}
								</div>
							)}
							{(requestStage === "Responded" && request.response !== '') && (
								<Link target="_blank" href={process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/' + request.response}>
									<div className="text-center py-4 bg-responded hover:bg-respondedhover">
										View the response
									</div>
								</Link>
							)}
						</div>
					</div>
					<div className="lg:hidden bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent h-[1px] w-full" />
				</>
			)}
		</>
	);
}

export default FOIRequestCard;
