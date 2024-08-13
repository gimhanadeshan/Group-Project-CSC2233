import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import EventCalendar from "@/Components/EventCalendar";

export default function Dashboard({ auth,allevents }) {
    //let roleID=auth.user.role_id;
    const calendarStyles = {
        height: '400px',
        width: '400px',
       
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Main Dashboard
                </h2>
            }
            permissions={auth.permissions}
        >

          

            <EventCalendar name={allevents} defaultView="month" views={['month','day']} style={ calendarStyles}/>








            <Head title="Dashboard" />
        </AuthenticatedLayout>
    );
}
