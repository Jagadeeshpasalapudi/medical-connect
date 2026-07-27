# MediConnect Hospital — Repaired Full Stack Project

## What was repaired

- Login and registration password show/hide eye controls.
- Patient, doctor, and admin route protection now matches the authenticated role.
- All frontend API requests use one authenticated Axios client and match backend routes.
- Doctor profile fields save and load from MongoDB, including arrays and availability.
- Patient appointment booking fields are validated and connected to MongoDB.
- Doctor appointment status actions are connected to the doctor backend routes.
- Admin doctor approval/rejection is connected to admin routes.
- Admin user delete and activate/disable actions are connected to backend routes.
- Admin appointment status updates use a dedicated admin backend endpoint.
- Doctor accounts without a profile can still enter the dashboard and are prompted to complete their profile.
- Dashboard, appointments, doctor management, user management, and doctor discovery refresh database data periodically for near-real-time updates.
- Modern responsive visual system added for auth controls and common UI elements.

## Run the project

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Important

The backend `.env` must contain a valid MongoDB connection string, JWT secret, port, and frontend client URL. The frontend `.env` must point `VITE_API_URL` to the backend API base URL, normally `http://localhost:5000/api`.
