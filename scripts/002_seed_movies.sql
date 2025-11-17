-- Seed sample movies
INSERT INTO public.movies (title, year, rating, genre, description, image_url) VALUES
('The Matrix Reloaded', 2003, 8.5, 'Sci-Fi, Action', 'Neo and his allies race against time before the machines discover the city of Zion.', '/cyberpunk-matrix-city-neon.jpg'),
('Inception', 2010, 8.8, 'Sci-Fi, Thriller', 'A thief who steals corporate secrets through dream-sharing technology.', '/dreamy-surreal-architecture.jpg'),
('Parasite', 2019, 8.6, 'Drama, Thriller', 'Greed and class discrimination threaten the newly formed symbiotic relationship.', '/modern-korean-cinema-dramatic.jpg'),
('Dune', 2021, 8.0, 'Sci-Fi, Adventure', 'Paul Atreides travels to the dangerous planet Arrakis to ensure the future of his family.', '/desert-landscape-epic-scale.jpg'),
('Oppenheimer', 2023, 8.5, 'Drama, History', 'The story of American scientist J. Robert Oppenheimer and his role in the Manhattan Project.', '/historical-drama-atomic.jpg'),
('The Shawshank Redemption', 1994, 9.3, 'Drama', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.', '/prison-redemption-emotional.jpg')
ON CONFLICT DO NOTHING;
