import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import EventCalendar from "@/Components/EventCalendar";

export default function EventCalendars({ auth,allevents }) {
    //let roleID=auth.user.role_id;
    const calendarStyles = {
        height: '800px',
        
       
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
           
            permissions={auth.permissions}
        >

          

            <EventCalendar name={allevents} defaultView="week" views={['month','week','day']} style={ calendarStyles}/>








            
        </AuthenticatedLayout>
    );
}
