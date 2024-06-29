import api from './api';

export const getClinics = async () => {
    const res = await api({contentType: true, auth:true}).get("hospitals");
    return res.data.hospitals;
}