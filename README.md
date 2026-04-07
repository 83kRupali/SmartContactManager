# Smart Contact Manager System

A full-stack web application to manage contacts securely with authentication, favorites, pinning, archiving, pagination, and a modern UI.

---

## 🚀 Features

- JWT-based authentication  
- Add, update, delete contacts  
- Favorite contacts  
- Pin important contacts  
- Archive / Unarchive contacts  
- Search & filter contacts  
- Pagination support  
- Dashboard overview  
- Export contacts to CSV  

---

## 🛠️ Tech Stack

### Backend
- Spring Boot  
- Spring Security  
- JWT Authentication  
- Spring Data JPA  
- MySQL  

### Frontend
- React.js  
- TypeScript  
- Tailwind CSS  
- Framer Motion  
- Lucide Icons  

---

##  #System Architecture#
##  1. Architecture Type :  3-Tier Architecture (Layered Architecture)
```[ Frontend (React) ]
          ↓
[ Backend (Spring Boot REST API) ]
          ↓
[ Database (MySQL) ]
```

## 2. High-Level Architecture Flow
```
User (Browser)
     ↓
React Frontend (UI + API Calls)
     ↓
Spring Boot Backend (Controllers → Security → Business Logic)
     ↓
Spring Data JPA (Repositories)
     ↓
MySQL Database
```

## Backend Architecture
```
Controller Layer
        ↓
Service Layer (Business Logic)
        ↓
Repository Layer (JPA)
        ↓
Database (MySQL)
```

## Request Flow
```
1. User logs in
2. Backend returns JWT token
3. Frontend stores token (localStorage)

4. User requests contacts
   → sends token in header

5. Backend JWT filter validates token
6. Extract userId
7. Controller handles request
8. Repository fetches data from DB
9. Response returned to frontend
```

##  Pagination Flow
```
Frontend:
GET /api/contacts?page=0&size=10

Backend:
- Pageable used
- Returns:
   content
   totalPages
   totalElements

Frontend:
- Displays page-wise data
```

## ⚙️ Setup Instructions


### 🔹 Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```


### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Images

<img width="960" height="504" alt="1" src="https://github.com/user-attachments/assets/37499ef0-e44f-4438-b684-a1af62f76bfd" />
<img width="960" height="504" alt="2" src="https://github.com/user-attachments/assets/59e29a71-99a7-4ae2-820a-8700cbbc08bc" />
<img width="960" height="504" alt="3" src="https://github.com/user-attachments/assets/f45f474c-23f1-46c5-9c2c-4819dd52bce4" />
<img width="960" height="504" alt="4" src="https://github.com/user-attachments/assets/29d77e5b-62fa-4448-863c-832b928f43ef" />
<img width="960" height="504" alt="5" src="https://github.com/user-attachments/assets/f014971f-fb77-495a-abe4-c5e81b0f7168" />
<img width="960" height="504" alt="6" src="https://github.com/user-attachments/assets/2094262d-9cd6-462a-9c1d-bbf5211788a1" />







