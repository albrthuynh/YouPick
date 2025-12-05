/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import '../index.css';

function HangoutCard(props: any) {
    const isFinalized = props.voteStatus === "Finalized";

    const borderColor = isFinalized 
        ? "border-green-500" 
        : "border-orange-500";

    const badgeColor = isFinalized
        ? "text-green-300"
        : "text-orange-300";

    return (
        <div className="flex justify-center">
            <div className={`relative flex flex-col my-6 bg-white shadow-lg border-4 ${borderColor} text-left rounded-xl w-[460px]`}>
                
                {/* Image */}
                <div className="relative h-72 m-3 overflow-hidden text-white rounded-lg">
                    <img 
                        src={props.image}
                        alt="Hangout"
                        className="w-full h-full object-cover"
                    />
                    <p className={`absolute bg-black bg-opacity-40 px-3 py-1 bottom-3 left-3 text-lg font-semibold rounded-md ${badgeColor}`}>
                        {props.voteStatus}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h6 className="mb-3 text-slate-800 text-2xl font-semibold">
                        {props.title}
                    </h6>

                    <p className="text-slate-600 text-lg font-light">
                        <span className="font-medium text-slate-700">Date:</span> {props.date}
                    </p>

                    <p className="text-slate-600 text-lg font-light">
                        <span className="font-medium text-slate-700">Time:</span> {props.time}
                    </p>

                    <p className="text-slate-600 text-lg font-light mt-5">
                        <span className="font-medium text-slate-700">Location:</span> {props.finalLocation}
                    </p>

                    <p className="text-slate-600 text-lg font-light mt-5">
                        <span className="font-medium text-slate-700">Activity:</span> {props.activity}
                    </p>

                    <div className="mt-5">
                        <h4 className="text-slate-800 font-semibold mb-1 text-lg">Organizer</h4>
                        <p className="text-slate-600 font-light">{props.organizer}</p>
                    </div>

                    
                </div>
            </div>
        </div>
    );
}

export default HangoutCard;


