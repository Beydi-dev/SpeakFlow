import { Link } from "react-router-dom";

function Landing() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Navigation */}
			<nav className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-xl">SF</span>
						</div>
						<span className="text-2xl font-bold text-gray-800">SpeakFlow</span>
					</div>
					<div className="space-x-4">
						<Link
							to="/connexion"
							className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
						>
							Connexion
						</Link>
						<Link
							to="/inscription"
							className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						>
							Commencer
						</Link>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="container mx-auto px-6 py-20">
				<div className="text-center max-w-4xl mx-auto">
					<h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
						Gérez vos discussions en
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
							{" "}temps réel
						</span>
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						SpeakFlow est la solution idéale pour organiser et gérer les files d'attente
						de parole lors de vos réunions, conférences et événements en ligne.
					</p>
					<div className="flex justify-center space-x-4">
						<Link
							to="/inscription"
							className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
						>
							Essayer gratuitement
						</Link>
						<a
							href="#features"
							className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border-2 border-blue-600"
						>
							En savoir plus
						</a>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="container mx-auto px-6 py-20">
				<h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
					Fonctionnalités principales
				</h2>
				<div className="grid md:grid-cols-3 gap-8">
					{/* Feature 1 */}
					<div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
							<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							Gestion de file d'attente
						</h3>
						<p className="text-gray-600">
							Organisez facilement l'ordre de parole des participants avec une interface intuitive.
						</p>
					</div>

					{/* Feature 2 */}
					<div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
						<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
							<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							Audio/Vidéo en temps réel
						</h3>
						<p className="text-gray-600">
							Intégration complète avec LiveKit pour une communication fluide et de haute qualité.
						</p>
					</div>

					{/* Feature 3 */}
					<div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
							<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							Sécurisé et privé
						</h3>
						<p className="text-gray-600">
							Authentification sécurisée avec Supabase pour protéger vos données et vos sessions.
						</p>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="bg-gray-50 py-20">
				<div className="container mx-auto px-6">
					<h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
						Comment ça marche ?
					</h2>
					<div className="max-w-3xl mx-auto space-y-8">
						<div className="flex items-start space-x-4">
							<div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
								1
							</div>
							<div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									Créez un compte
								</h3>
								<p className="text-gray-600">
									Inscrivez-vous gratuitement en quelques secondes avec votre email.
								</p>
							</div>
						</div>
						<div className="flex items-start space-x-4">
							<div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
								2
							</div>
							<div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									Créez ou rejoignez une room
								</h3>
								<p className="text-gray-600">
									Démarrez une nouvelle session ou rejoignez une room existante avec un code.
								</p>
							</div>
						</div>
						<div className="flex items-start space-x-4">
							<div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
								3
							</div>
							<div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									Gérez la file d'attente
								</h3>
								<p className="text-gray-600">
									Les participants s'ajoutent à la queue et parlent à leur tour de manière organisée.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="container mx-auto px-6 py-20">
				<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
					<h2 className="text-4xl font-bold text-white mb-4">
						Prêt à améliorer vos réunions ?
					</h2>
					<p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
						Rejoignez SpeakFlow dès aujourd'hui et découvrez une nouvelle façon de gérer les discussions.
					</p>
					<Link
						to="/inscription"
						className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg"
					>
						Commencer maintenant
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-gray-300 py-12">
				<div className="container mx-auto px-6">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="mb-4 md:mb-0">
							<span className="text-2xl font-bold text-white">SpeakFlow</span>
							<p className="text-gray-400 mt-2">Gérez vos discussions en temps réel</p>
						</div>
						<div className="flex space-x-6">
							<a href="#" className="hover:text-white transition">À propos</a>
							<a href="#" className="hover:text-white transition">Contact</a>
							<a href="https://github.com" className="hover:text-white transition">GitHub</a>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
						<p>&copy; 2025 SpeakFlow. Tous droits réservés.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default Landing;
