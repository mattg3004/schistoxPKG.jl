var documenterSearchIndex = {"docs":
[{"location":"man/parameters/#Parameters","page":"Parameters","title":"Parameters","text":"","category":"section"},{"location":"man/parameters/","page":"Parameters","title":"Parameters","text":"N: size of human population (Int)\n\ntime_step: length of time in days to step forward each time (Float)\n\nN_communities: number of communities sharing the same environmental source (Int)\n\ncommunity_probs: probability of an integer being in a given community. This governs\nthe population sizes in each community. This must be an array the length of\nN_communities (Array(Float))\n\ncommunity_contact_rate: contact rate with the environment for each of the communities. \nThis must be an array the length of N_communities (Array(Float))\n\ndensity_dependent_fecundity: decrease in egg production per worm due to high density\nof worms (Float)\n\naverage_worm_lifespan: average life expectancy of a worm (Float)\n\nmax_age: maximum age of human in the population (Float)\n\ninitial_worms: number of worms in each person to begin with. The actual number in \neach person if chosen from a Poisson distirubiton with this mean (Int)\n\ninitial_miracidia: initial number of miracidia larvae in the environment (Int)\n\ninitial_miracidia_days: miracidia will age into cercariae larvae after a specified\nnumber of days. This parameter will specify how many days of initial_miracidia we \nwill have already had in the environment (Int)\n\ninit_env_cercariae: initial number of cercariae larvae in the environment (Int)\n\nworm_stages: how many age stages are there for the worms. Having 1 stage will give\nGamma distributed death ages, while more than 1 will result in Erlang distribution (Int)\n\ncontact_rate: global contact rate for the uptake of larvae from the environment (Float)\n\nmax_fecundity: expected number of eggs from a single worm pair. The actual number \nwill be chosen from a distribution with this mean (Float)\n\nage_contact_rates: contact rate for chosen age groups(Array(Float))\n\nages_for_contacts: age groups for specifying contact rates (Array(Int))\n\ncontact_rate_by_age_array: array holding contact rate for each age (Array(Float))\n\nmda_adherence: proportion of people who adhere to the mda (Float)\n\nmda_access: proportion of people who have access to the mda (Float)\n\nfemale_factor: factor for altering the contact rate for females, if we choose to \nhave gender specific behaviour which affects contact rate (Float)\n\nmale_factor: factor for altering the contact rate for males, if we choose to have \ngender specific behaviour which affects contact rate (Float)\n\nmiracidia_maturity: number of days after which miracidias will mature to cercariae (Int)\n\nbirth_rate: rate of birth of humans (Float)\n\nhuman_cercariae_prop: proportion of cercariae which are able to infect humans (Float)\n\npredis_aggregation: aggregation for predisposition of individuals to uptake larvae.\nThis is chosen from a Gamma distribution with mean 1 for each individual and set for \nlife. If this is high, then the aggregation is low, meaning that most individuals\nhave roughly the same predisposition. If it is low, then the larvae become\nconcentrated in a few individuals. (Float)\n\ncercariae_survival: what proportion of cercariae survive from one time point\nto the next (Float)\n\nmiracidia_survival: what proportion of miracidia survive from one time point \nto the next (Float)\n\ndeath_prob_by_age: for specified age range, what is the probability of dying \neach year (Array(Float))\n\nages_for_death: age ranges for death probabilities (Array(Float))\n\nr: aggregation parameter for negative binomially distributed egg production (Float)\n\nvaccine_effectiveness: efficacy of a vaccine if one is used(Float)\n\ndrug_effectiveness: efficacy of a drug given during MDA(Float)\n\nspec_ages: number of individuals by age group which we specify if we want a \nparticular age distribution for the simulation (Array(Float))\n\nages_per_index: how many different ages we include in the spec_ages parameter (Int)\n\nrecord_frequency: how often we should record the prevalence in the population \nduring simulation (Float)\n\nuse_kato_katz: if 0, then don't use Kato-Katz (KK) for egg counts, if 1, use KK (Int)\n\nkato_katz_par: parameter for Gamma distribution if KK is used (Float)\n\nheavy_burden_threshold: number of eggs at which an individual is said to have a\nheavy infection (Int)\n\nrate_acquired_immunity: rate at which immunity will be acquired for individuals.\nThis will be multiplied by the cumulative number of worms people have had throughout\ntheir life to decide the level of immunity acquired (Float)\n\nM0: if a particular for of egg production is used, this parameter is required and is\na proxy for mean worm burden (Float) \n\nhuman_larvae_maturity_time: length of time in days after which a cercariae uptaken by\na human will mature into a worm (Int)\n","category":"page"},{"location":"#Schistoxpkg.jl","page":"Home","title":"Schistoxpkg.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"A package to run an individual based model of a schistosomiasis outbreak based on original code from this paper. Generally people uptake larvae based on a contact rate defined by their age, along with some predisposition which is chosen from a gamma distribution with mean 1, but some specified level of variance.","category":"page"},{"location":"","page":"Home","title":"Home","text":"All parameters are stored in the parameters.jl file in the src folder.","category":"page"},{"location":"","page":"Home","title":"Home","text":"The model has a parameter which defines the time step that we take forward each time. Several functions are then called each time step which simulate the run of the outbreak. This is repeated until we reach a specified number of steps, usually corresponding to stepping forward a chosen number of years into the future.","category":"page"},{"location":"#Model-description","page":"Home","title":"Model description","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The standard approach is given by the following set of processes which all have their own function to execute them. First, load required packages and include the parameters file which stores the parameters for the model.","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Schistoxpkg\nusing Random\nusing JLD\nusing Distributions\nusing PyPlot\ninclude(\"parameters.jl\")","category":"page"},{"location":"","page":"Home","title":"Home","text":"After this, we must initialize the pars struct, which will be used to store the parameters.","category":"page"},{"location":"","page":"Home","title":"Home","text":"pars = Parameters(N, time_step, N_communities, community_probs, community_contact_rate,\n                  density_dependent_fecundity, average_worm_lifespan,\n                  max_age, initial_worms, initial_miracidia, \n                  initial_miracidia_days, init_env_cercariae,\n                  worm_stages, contact_rate, max_fecundity, age_contact_rates,\n                  ages_for_contacts, contact_rate_by_age_array, mda_adherence, \n                  mda_access,  female_factor, male_factor, miracidia_maturity,\n                  birth_rate, human_cercariae_prop, predis_aggregation, \n                  cercariae_survival, miracidia_survival,\n                  death_prob_by_age, ages_for_death, r, \n                  vaccine_effectiveness, drug_effectiveness,\n                  spec_ages, ages_per_index, record_frequency, \n                  use_kato_katz, kato_katz_par, heavy_burden_threshold,\n                  rate_acquired_immunity, M0, human_larvae_maturity_time)\n\npars = make_age_contact_rate_array(pars, scenario, [],[]);","category":"page"},{"location":"","page":"Home","title":"Home","text":"We then counstruct the initial host population and initialize the environment cercariae and mircacidia larvae. We also age the population forward for a certain number of steps (here 20,000), so that there are no individuals in the population whose death age is lower than their actual age, and the death rate dynamics have time to achieve a desired age distribution. We also update the age based contact rates according to the new ages in the population.","category":"page"},{"location":"","page":"Home","title":"Home","text":"humans, miracidia, cercariae = create_population_specified_ages(pars)\nhumans = generate_ages_and_deaths(20000, humans, pars)\nhumans = update_contact_rate(humans,  pars)\n\nmda_info = []\n\nvaccine_info = []","category":"page"},{"location":"","page":"Home","title":"Home","text":"Each time step we advance the time of the simulation by the length of the time step and also add this time step to the age of each individual. There is a chosen period at which contact rates are updated for each individual, where we check if someone has aged into a different age bracket, resulting if their level of contact has changed.","category":"page"},{"location":"","page":"Home","title":"Home","text":"We then calculate the total number of worms within each individual and the number of pairs of worms a person has. These numbers are used to calculate how many eggs someone will produce. The number of eggs is chosen from a poisson distribution with mean equal to the number of worm pairs multiplied by the max fecundity parameter and then multiplied by an exponential function which calculates the density dependent reduction in eggs produced, λ wp exp(-wp z). We then kill the worms within human hosts at a given rate, which is based on average worm lifespan.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Eggs are then hatched into the environment, with egg release dependent on the age specific contact rate of each individual. Humans are given an age of death when they are born, which is based on some chosen death rates for each age group. We check each time step if anyone has outlived their age of death and if they have, they are then removed from the population. Cercariae from the environment are then uptaken to each surviving individual based on their predisposition and contact rate. These immediately become worms within the human host.","category":"page"},{"location":"","page":"Home","title":"Home","text":"We then perform any interventions which are due to take place at this point in time after which we will cull the miracidia and cercariae in the environment by a chosen percentage. After this we will add births to the population which occur at some specified rate.","category":"page"},{"location":"","page":"Home","title":"Home","text":"A version of this is done by with the following function:","category":"page"},{"location":"","page":"Home","title":"Home","text":"number_years = 200\nnum_time_steps = trunc(Int, 365*number_years / time_step)\nhumans, miracidia, cercariae, record = \nupdate_env_no_births_deaths_human_larvae(num_time_steps, humans,  miracidia, \n                                         cercariae, pars, mda_info, vaccine_info)","category":"page"},{"location":"","page":"Home","title":"Home","text":"There are other versions of this basic approach, where we don't age the population or include births and deaths and also where the population is aged but every death is simply matched with a birth, resulting in the population being kept constant.","category":"page"},{"location":"","page":"Home","title":"Home","text":"To consider interventions such as MDA, we can run the following function:","category":"page"},{"location":"","page":"Home","title":"Home","text":"mda_info = create_mda(0, .75, 0, 1, 10, 1, [0,1], [0,1], [0,1], pars.drug_effectiveness)","category":"page"},{"location":"","page":"Home","title":"Home","text":"The first 3 entries of the create_mda function specify the proportion of individuals in the pre-SAC, SAC and adults. The fourth and fifth entries specifies the time point at which the first and last MDA with take place and the sixth entry specifies how many will take place per year in the intervening time period. The next 3 entries specify the gender to be included in the pre-SAC, SAC and adult MDA programs and the final entry is the efficacy of the drug used.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Pages = [\n    \"man/functions.md\",\n]\nDepth = 1","category":"page"},{"location":"man/functions/#Functions","page":"Functions","title":"Functions","text":"","category":"section"},{"location":"man/functions/","page":"Functions","title":"Functions","text":"Functions included in the Schistoxpkg.","category":"page"},{"location":"man/functions/","page":"Functions","title":"Functions","text":"Modules = [Schistoxpkg]","category":"page"},{"location":"man/functions/#Schistoxpkg.cercariae_uptake!-NTuple{4,Any}","page":"Functions","title":"Schistoxpkg.cercariae_uptake!","text":"cercariae_uptake(humans, cercariae, miracidia, pars)\n\nuptake cercariae into humans, whilst updating cercariae with miracidia. Uptaken cercariae immediately become worms in this formulation\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.cercariae_uptake_with_human_larvae!-NTuple{4,Any}","page":"Functions","title":"Schistoxpkg.cercariae_uptake_with_human_larvae!","text":"cercariae_uptake(humans, cercariae, miracidia, pars)\n\nuptake cercariae into humans, whilst updating cercariae with miracidia. Uptaken cercariae immediately become worms in this formulation\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.create_population-Tuple{Any}","page":"Functions","title":"Schistoxpkg.create_population","text":"create_population\n\nThis will create the initial human population with randomly chosen age, and gender. Predisposition is taken to be gamma distributed There is also a male and female adjustment to predisposition adjusting for gender specific behaviour In addition to this, it will create the initial miracidia environment vector\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.create_population_specified_ages-Tuple{Any}","page":"Functions","title":"Schistoxpkg.create_population_specified_ages","text":"create_population_specified_ages\n\nThis will create the initial human population with an age distribution specified by the spec_ages variable Predisposition is taken to be gamma distributed. There is also a male and female adjustment to predisposition adjusting for gender specific behaviour In addition to this, it will create the initial miracidia environment vector\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.egg_production!-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.egg_production!","text":"egg_production(humans, pars)\n\nfunction to produce eggs for individuals, dependent on how many worms they have         and the max fecundity and density dependent fecundity of the population\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.update_contact_rate-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.update_contact_rate","text":"update_contact_rate(humans, pars)\n\nfunction to update the contact rate of individuals in the population. This is necessary     as over time when people age, they will move through different age groups which have     different contact rates\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.worm_maturity!-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.worm_maturity!","text":"worm_maturity(humans, pars)\n\nfunction to kill worms, and if there is more than one stage for worm life,         to update how many worms are in each stage\n\n\n\n\n\n","category":"method"}]
}
