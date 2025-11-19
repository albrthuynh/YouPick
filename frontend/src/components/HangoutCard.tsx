import { Link } from 'react-router-dom';
import '../index.css';

function HangoutCard(props) {
    const statusColor =
        props.voteStatus === "Finalized"
            ? "text-green-600"
            : "text-orange-500";

    return (
        <div className='hangout-card'>
            <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96">
                
                <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
                    <img 
                        src="https://americanbehavioralclinics.com/wp-content/uploads/2023/06/Depositphotos_252922046_L.jpg" 
                        alt="card-image" 
                    />
                    <p className={`absolute bg-black p-2 bottom-2 left-2 text-lg font-semibold drop-shadow ${statusColor} rounded-lg bg-opacity-30`}>
                        {props.voteStatus}
                    </p>
                </div>

                <div className="p-4">
                    <h6 className="mb-2 text-slate-800 text-xl font-semibold">
                        {props.title}
                    </h6>

                    <p className="text-slate-600 leading-normal font-light">
                        {props.date}
                    </p>

                    <p className="text-slate-600 leading-normal font-light">
                        {props.location}
                    </p>

                    <div className="mt-4">
                            <h4 className="text-slate-800 font-semibold mb-2">Organizer</h4>
                            <p className="text-slate-600 leading-normal font-light">
                                {props.organizer}
                            </p>
                    </div>

                    {/* Invited List */}
                    {props.invited && props.invited.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-slate-800 font-semibold mb-2">Invited</h4>
                            <ul className="list-none ml-0 text-slate-600">
                                {props.invited.map((person, index) => (
                                    <li key={index} className="mb-1">
                                        <span className="font-medium">{person.name}</span> – 
                                        <span className="ml-1 capitalize">{person.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="px-4 pb-4 pt-0 mt-2">
                    <button 
                        className="rounded-md bg-slate-800 py-2 px-4 text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 hover:bg-slate-700"
                        type="button"
                    >
                        Learn More
                    </button>
                </div>

            </div>  
        </div>
    );
}

export default HangoutCard;


