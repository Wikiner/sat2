import React, { useState } from 'react';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock data for workouts and coaches
  const [workouts, setWorkouts] = useState([
    { id: 1, day: 'Понедельник', type: 'Йога', time: '18:00-19:30', coach: 'Анна Иванова', spots: 12, registered: false },
    { id: 2, day: 'Вторник', type: 'Силовые', time: '19:00-20:30', coach: 'Дмитрий Петров', spots: 5, registered: false },
    { id: 3, day: 'Среда', type: 'Пилатес', time: '17:30-19:00', coach: 'Ольга Смирнова', spots: 8, registered: false },
    { id: 4, day: 'Четверг', type: 'Табата', time: '20:00-21:00', coach: 'Игорь Кузнецов', spots: 10, registered: false },
    { id: 5, day: 'Пятница', type: 'Кроссфит', time: '19:30-21:00', coach: 'Елена Новикова', spots: 3, registered: false },
    { id: 6, day: 'Суббота', type: 'Функциональная тренировка', time: '10:00-11:30', coach: 'Максим Орлов', spots: 7, registered: false },
  ]);

  const workoutTypes = [...new Set(workouts.map(w => w.type))];

  const coaches = [
    { id: 1, name: 'Анна Иванова', specialty: 'Йога и растяжка', experience: '7 лет' },
    { id: 2, name: 'Дмитрий Петров', specialty: 'Силовые тренировки', experience: '10 лет' },
    { id: 3, name: 'Ольга Смирнова', specialty: 'Пилатес и коррекция осанки', experience: '8 лет' },
    { id: 4, name: 'Игорь Кузнецов', specialty: 'Выносливость и HIIT', experience: '6 лет' },
    { id: 5, name: 'Елена Новикова', specialty: 'Кроссфит и функциональный тренинг', experience: '9 лет' },
    { id: 6, name: 'Максим Орлов', specialty: 'Общая физическая подготовка', experience: '8 лет' },
  ];

  const [userWorkouts, setUserWorkouts] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');

    if (username && password) {
      setUser({ id: 1, name: username });
      setIsLoggedIn(true);
      setActivePage('account');
    }
  };

  const registerForWorkout = (id) => {
    setWorkouts(prev =>
      prev.map(workout =>
        workout.id === id
          ? {
              ...workout,
              spots: workout.spots - 1,
              registered: true
            }
          : workout
      )
    );

    const selectedWorkout = workouts.find(w => w.id === id);
    const date = new Date();
    const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    setUserWorkouts(prev => [
      ...prev,
      {
        workoutId: id,
        date: today,
        status: 'upcoming'
      }
    ]);
  };

  const cancelRegistration = (id) => {
    setWorkouts(prev =>
      prev.map(workout =>
        workout.id === id
          ? {
              ...workout,
              spots: workout.spots + 1,
              registered: false
            }
          : workout
      )
    );

    setUserWorkouts(prev => prev.filter(uw => uw.workoutId !== id));
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage setActivePage={setActivePage} />;
      case 'schedule':
        return (
          <SchedulePage
            workouts={workouts}
            workoutTypes={workoutTypes}
            setActivePage={setActivePage}
            isLoggedIn={isLoggedIn}
            registerForWorkout={registerForWorkout}
            cancelRegistration={cancelRegistration}
          />
        );
      case 'coaches':
        return <CoachesPage coaches={coaches} setActivePage={setActivePage} />;
      case 'account':
        return (
          <AccountPage
            user={user}
            isLoggedIn={isLoggedIn}
            userWorkouts={userWorkouts}
            workouts={workouts}
            setActivePage={setActivePage}
            setIsLoggedIn={setIsLoggedIn}
            setUser={setUser}
            cancelRegistration={cancelRegistration}
          />
        );
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />

      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
}

function Header({ activePage, setActivePage, isLoggedIn, setIsLoggedIn, setUser }) {
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setActivePage('home');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
            SC
          </div>

          {/* Club Name */}
          <h1 className="text-2xl font-bold text-gray-800">SportClub</h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8">
          <button
            onClick={() => setActivePage('home')}
            className={`font-medium ${activePage === 'home' ? 'text-red-500' : 'text-gray-600 hover:text-red-500 transition-colors'}`}
          >
            Главная
          </button>
          <button
            onClick={() => setActivePage('schedule')}
            className={`font-medium ${activePage === 'schedule' ? 'text-red-500' : 'text-gray-600 hover:text-red-500 transition-colors'}`}
          >
            Расписание
          </button>
          <button
            onClick={() => setActivePage('coaches')}
            className={`font-medium ${activePage === 'coaches' ? 'text-red-500' : 'text-gray-600 hover:text-red-500 transition-colors'}`}
          >
            Тренеры
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => setActivePage('account')}
              className={`font-medium ${activePage === 'account' ? 'text-red-500' : 'text-gray-600 hover:text-red-500 transition-colors'}`}
            >
              Личный кабинет
            </button>
          ) : (
            <button
              onClick={() => setActivePage('account')}
              className="font-medium text-gray-600 hover:text-red-500 transition-colors"
            >
              Войти
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Выход
            </button>
          ) : (
            <button
              onClick={() => setActivePage('account')}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// HomePage остается без изменений
function HomePage({ setActivePage }) {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Добро пожаловать в SportClub</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Ваше здоровье и физическая форма — наша главная цель. Присоединяйтесь к нашему сообществу и начните путь к лучшей версии себя.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setActivePage('schedule')}
            className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-lg font-medium"
          >
            Посмотреть расписание
          </button>
          <button
            onClick={() => setActivePage('coaches')}
            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-lg font-medium"
          >
            Наши тренеры
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Гибкое расписание</h3>
          <p className="text-gray-600">Разнообразные тренировки в удобное для вас время с понедельника по субботу.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Профессионалы</h3>
          <p className="text-gray-600">Наши опытные тренеры помогут достичь ваших целей безопасно и эффективно.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Прогресс</h3>
          <p className="text-gray-600">Отслеживайте свои тренировки и отмечайте достижения в личном кабинете.</p>
        </div>
      </section>
    </div>
  );
}

function SchedulePage({
  workouts,
  workoutTypes,
  setActivePage,
  isLoggedIn,
  registerForWorkout,
  cancelRegistration
}) {
  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const filteredWorkouts = workouts.filter(workout => {
    return (!selectedDay || workout.day === selectedDay) &&
           (!selectedType || workout.type === selectedType);
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Расписание тренировок</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ознакомьтесь с нашим расписанием тренировок. Подберите занятие, которое подходит именно вам!
        </p>
      </div>

      <div className="mb-8 grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dayFilter" className="block text-gray-700 mb-2">Фильтр по дню недели:</label>
          <select
            id="dayFilter"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Все дни</option>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="typeFilter" className="block text-gray-700 mb-2">Фильтр по типу тренировки:</label>
          <select
            id="typeFilter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Все типы</option>
            {workoutTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map(workout => (
            <div key={workout.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative">
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => toggleFavorite(workout.id)}
                  className="text-gray-400 hover:text-red-500 focus:outline-none"
                  aria-label="Добавить в избранное"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill={favorites.includes(workout.id) ? "red" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-2">{workout.type}</h4>
                <div className="flex items-center text-gray-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{workout.time}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{workout.coach}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Свободных мест: {workout.spots}</span>
                </div>

                {isLoggedIn ? (
                  workout.registered ? (
                    <button
                      onClick={() => cancelRegistration(workout.id)}
                      className="w-full mt-2 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    >
                      Отменить запись
                    </button>
                  ) : workout.spots > 0 ? (
                    <button
                      onClick={() => registerForWorkout(workout.id)}
                      className="w-full mt-2 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Записаться
                    </button>
                  ) : (
                    <button disabled className="w-full mt-2 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed">
                      Мест нет
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => setActivePage('account')}
                    className="w-full mt-2 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Войдите, чтобы записаться
                  </button>
                )}

                {workout.registered && (
                  <div className="mt-2 text-green-600 text-center font-medium">
                    Вы записаны
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic col-span-full">Нет тренировок по заданным фильтрам</p>
        )}
      </div>
    </div>
  );
}

function CoachesPage({ coaches, setActivePage }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Наши тренеры</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Профессиональные и опытные тренеры, которые помогут вам достичь ваших целей.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coaches.map(coach => (
          <div key={coach.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <img src={`https://picsum.photos/200/300?random=${coach.id}`} alt={coach.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-1">{coach.name}</h3>
              <p className="text-red-500 font-medium mb-3">{coach.specialty}</p>
              <div className="flex items-center text-gray-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Стаж: {coach.experience}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountPage({
  user,
  isLoggedIn,
  userWorkouts,
  workouts,
  setActivePage,
  setIsLoggedIn,
  setUser,
  cancelRegistration
}) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    if (username && email && password) {
      setUser({ id: 2, name: username });
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Пожалуйста, заполните все поля');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');

    if (username && password) {
      setUser({ id: 1, name: username });
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Пожалуйста, введите имя пользователя и пароль');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isRegistering ? 'Регистрация' : 'Вход в аккаунт'}
          </h2>
          <p className="text-gray-600">
            {isRegistering ? 'Создайте свой аккаунт' : 'Введите свои данные для входа'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {isRegistering && (
            <div className="mb-4">
              <label htmlFor="username-register" className="block text-gray-700 mb-2">Имя пользователя</label>
              <input
                type="text"
                id="username-register"
                name="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Введите имя пользователя"
              />
            </div>
          )}

          {isRegistering && (
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Введите email"
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Введите имя пользователя"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Введите пароль"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            {isRegistering ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl font-bold text-red-500">{user.name.charAt(0)}</span>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">Пользователь SportClub</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Будущие тренировки</h3>
          <div className="space-y-4">
            {userWorkouts
              .filter(uw => uw.status === 'upcoming')
              .map((uw, index) => {
                const workout = workouts.find(w => w.id === uw.workoutId);
                return workout ? (
                  <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-semibold text-gray-800">{workout.type}</h4>
                    <div className="flex items-center text-gray-600 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(uw.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{workout.time}</span>
                    </div>
                    <button
                      onClick={() => cancelRegistration(workout.id)}
                      className="mt-2 text-sm text-red-500 hover:text-red-700"
                    >
                      Отменить запись
                    </button>
                  </div>
                ) : null;
              })
            }
            {userWorkouts.filter(uw => uw.status === 'upcoming').length === 0 && (
              <p className="text-gray-500 italic">Нет будущих тренировок</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Прошедшие тренировки</h3>
          <div className="space-y-4">
            {userWorkouts
              .filter(uw => uw.status === 'completed')
              .map((uw, index) => {
                const workout = workouts.find(w => w.id === uw.workoutId);
                return workout ? (
                  <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-semibold text-gray-800">{workout.type}</h4>
                    <div className="flex items-center text-gray-600 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(uw.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{workout.time}</span>
                    </div>
                  </div>
                ) : null;
              })
            }
            {userWorkouts.filter(uw => uw.status === 'completed').length === 0 && (
              <p className="text-gray-500 italic">Нет прошедших тренировок</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SportClub</h3>
            <p className="text-gray-400">
              Ваш путь к здоровому образу жизни начинается здесь. Присоединяйтесь к нашему сообществу.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>ул. Басейная 46, г. Калининград</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+7 (495) 123-45-67</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@sportclub.ru</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Часы работы</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Понедельник - Пятница: 7:00 - 23:00</li>
              <li>Суббота: 8:00 - 21:00</li>
              <li>Воскресенье: 9:00 - 20:00</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Подписаться</h3>
            <p className="text-gray-400 mb-4">Подпишитесь на наши новости и получайте информацию о новых тренировках.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Ваш email"
                className="px-4 py-2 w-full rounded-l-md focus:outline-none"
              />
              <button className="bg-red-500 text-white px-4 py-2 rounded-r-md hover:bg-red-600 transition-colors">
                Отправить
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2023 SportClub. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}