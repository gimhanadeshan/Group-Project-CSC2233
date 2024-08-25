import Authenticated from '@/Layouts/AuthenticatedLayout'
import NotificationDropdown from '@/Components/NotificationDropdown'
import { useForm, Head, Link } from '@inertiajs/react';
import React from 'react'

export default function Index({auth,unreadNotifications,readNotifications}) {
  return (
    <Authenticated
    user={auth.user} permissions={auth.permissions}
    >
        <Head title="Notifications" />
        <NotificationDropdown unreadNotifications={unreadNotifications} readNotifications={readNotifications}/>
    </Authenticated>
  )
}
