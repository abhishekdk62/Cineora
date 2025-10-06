import apiClient from '@/app/others/Utils/apiClient'
import React, { useEffect } from 'react'

const AnalyticsManager = () => {
    async function getatas() {
        const data = await apiClient.get('/admin/analytics/data/analytics')
        console.log(data);
    }
    useEffect(() => {
        getatas()

    })
    return (
        <div>AnalyticsManager</div>
    )
}

export default AnalyticsManager