var documenterSearchIndex = {"docs":
[{"location":"man/parameters/#Parameters","page":"Parameters","title":"Parameters","text":"","category":"section"},{"location":"man/parameters/","page":"Parameters","title":"Parameters","text":"N: size of human population (Int)\n\ntime_step: length of time in days to step forward each time (Float)\n\nN_communities: number of communities sharing the same environmental source (Int)\n\ncommunity_probs: probability of an integer being in a given community. This governs\nthe population sizes in each community. This must be an array the length of\nN_communities (Array(Float))\n\ncommunity_contact_rate: contact rate with the environment for each of the communities. \nThis must be an array the length of N_communities (Array(Float))\n\ndensity_dependent_fecundity: decrease in egg production per worm due to high density\nof worms (Float)\n\naverage_worm_lifespan: average life expectancy of a worm (Float)\n\nmax_age: maximum age of human in the population (Float)\n\ninitial_worms: number of worms in each person to begin with. The actual number in \neach person if chosen from a Poisson distirubiton with this mean (Int)\n\ninitial_miracidia: initial number of miracidia larvae in the environment (Int)\n\ninitial_miracidia_days: miracidia will age into cercariae larvae after a specified\nnumber of days. This parameter will specify how many days of initial_miracidia we \nwill have already had in the environment (Int)\n\ninit_env_cercariae: initial number of cercariae larvae in the environment (Int)\n\nworm_stages: how many age stages are there for the worms. Having 1 stage will give\nGamma distributed death ages, while more than 1 will result in Erlang distribution (Int)\n\ncontact_rate: global contact rate for the uptake of larvae from the environment (Float)\n\nmax_fecundity: expected number of eggs from a single worm pair. The actual number \nwill be chosen from a distribution with this mean (Float)\n\nage_contact_rates: contact rate for chosen age groups(Array(Float))\n\nages_for_contacts: age groups for specifying contact rates (Array(Int))\n\ncontact_rate_by_age_array: array holding contact rate for each age (Array(Float))\n\nmda_adherence: proportion of people who adhere to the mda (Float)\n\nmda_access: proportion of people who have access to the mda (Float)\n\nfemale_factor: factor for altering the contact rate for females, if we choose to \nhave gender specific behaviour which affects contact rate (Float)\n\nmale_factor: factor for altering the contact rate for males, if we choose to have \ngender specific behaviour which affects contact rate (Float)\n\nmiracidia_maturity: number of days after which miracidias will mature to cercariae (Int)\n\nbirth_rate: rate of birth of humans (Float)\n\nhuman_cercariae_prop: proportion of cercariae which are able to infect humans (Float)\n\npredis_aggregation: aggregation for predisposition of individuals to uptake larvae.\nThis is chosen from a Gamma distribution with mean 1 for each individual and set for \nlife. If this is high, then the aggregation is low, meaning that most individuals\nhave roughly the same predisposition. If it is low, then the larvae become\nconcentrated in a few individuals. (Float)\n\ncercariae_survival: what proportion of cercariae survive from one time point\nto the next (Float)\n\nmiracidia_survival: what proportion of miracidia survive from one time point \nto the next (Float)\n\ndeath_prob_by_age: for specified age range, what is the probability of dying \neach year (Array(Float))\n\nages_for_death: age ranges for death probabilities (Array(Float))\n\nr: aggregation parameter for negative binomially distributed egg production (Float)\n\nvaccine_effectiveness: efficacy of a vaccine if one is used(Float)\n\ndrug_effectiveness: efficacy of a drug given during MDA(Float)\n\nspec_ages: number of individuals by age group which we specify if we want a \nparticular age distribution for the simulation (Array(Float))\n\nages_per_index: how many different ages we include in the spec_ages parameter (Int)\n\nrecord_frequency: how often we should record the prevalence in the population \nduring simulation (Float)\n\nuse_kato_katz: if 0, then don't use Kato-Katz (KK) for egg counts, if 1, use KK (Int)\n\nkato_katz_par: parameter for Gamma distribution if KK is used (Float)\n\nheavy_burden_threshold: number of eggs at which an individual is said to have a\nheavy infection (Int)\n\nrate_acquired_immunity: rate at which immunity will be acquired for individuals.\nThis will be multiplied by the cumulative number of worms people have had throughout\ntheir life to decide the level of immunity acquired (Float)\n\nM0: if a particular for of egg production is used, this parameter is required and is\na proxy for mean worm burden (Float) \n\nhuman_larvae_maturity_time: length of time in days after which a cercariae uptaken by\na human will mature into a worm (Int)\n","category":"page"},{"location":"#Schistoxpkg.jl","page":"Home","title":"Schistoxpkg.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"A package to run an individual based model of a schistosomiasis outbreak based on original code from this paper. Generally people uptake larvae based on a contact rate defined by their age, along with some predisposition which is chosen from a gamma distribution with mean 1, but some specified level of variance.","category":"page"},{"location":"","page":"Home","title":"Home","text":"All parameters are stored in the parameters.jl file in the src folder.","category":"page"},{"location":"","page":"Home","title":"Home","text":"The model has a parameter which defines the time step that we take forward each time. Several functions are then called each time step which simulate the run of the outbreak. This is repeated until we reach a specified number of steps, usually corresponding to stepping forward a chosen number of years into the future.","category":"page"},{"location":"#Model-description","page":"Home","title":"Model description","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The standard approach is given by the following set of processes which all have their own function to execute them. First, load required packages and include the parameters file which stores the parameters for the model.","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Schistoxpkg\nusing Random\nusing JLD\nusing Distributions\nusing PyPlot\ninclude(\"parameters.jl\")","category":"page"},{"location":"","page":"Home","title":"Home","text":"After this, we must initialize the pars struct, which will be used to store the parameters.","category":"page"},{"location":"","page":"Home","title":"Home","text":"pars = Parameters(N, time_step, N_communities, community_probs, community_contact_rate,\n                  density_dependent_fecundity, average_worm_lifespan,\n                  max_age, initial_worms, initial_miracidia, \n                  initial_miracidia_days, init_env_cercariae,\n                  worm_stages, contact_rate, max_fecundity, age_contact_rates,\n                  ages_for_contacts, contact_rate_by_age_array, mda_adherence, \n                  mda_access,  female_factor, male_factor, miracidia_maturity,\n                  birth_rate, human_cercariae_prop, predis_aggregation, \n                  cercariae_survival, miracidia_survival,\n                  death_prob_by_age, ages_for_death, r, \n                  vaccine_effectiveness, drug_effectiveness,\n                  spec_ages, ages_per_index, record_frequency, \n                  use_kato_katz, kato_katz_par, heavy_burden_threshold,\n                  rate_acquired_immunity, M0, human_larvae_maturity_time)\n\npars = make_age_contact_rate_array(pars, scenario, [],[]);","category":"page"},{"location":"","page":"Home","title":"Home","text":"We then counstruct the initial host population and initialize the environment cercariae and mircacidia larvae. We also age the population forward for a certain number of steps (here 20,000), so that there are no individuals in the population whose death age is lower than their actual age, and the death rate dynamics have time to achieve a desired age distribution. We also update the age based contact rates according to the new ages in the population.","category":"page"},{"location":"","page":"Home","title":"Home","text":"humans, miracidia, cercariae = create_population_specified_ages(pars)\nhumans = generate_ages_and_deaths(20000, humans, pars)\nhumans = update_contact_rate(humans,  pars)\n\nmda_info = []\n\nvaccine_info = []","category":"page"},{"location":"","page":"Home","title":"Home","text":"Each time step we advance the time of the simulation by the length of the time step and also add this time step to the age of each individual. There is a chosen period at which contact rates are updated for each individual, where we check if someone has aged into a different age bracket, resulting if their level of contact has changed.","category":"page"},{"location":"","page":"Home","title":"Home","text":"We then calculate the total number of worms within each individual and the number of pairs of worms a person has. These numbers are used to calculate how many eggs someone will produce. The number of eggs is chosen from a poisson distribution with mean equal to the number of worm pairs multiplied by the max fecundity parameter and then multiplied by an exponential function which calculates the density dependent reduction in eggs produced, λ wp exp(-wp z). We then kill the worms within human hosts at a given rate, which is based on average worm lifespan.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Eggs are then hatched into the environment, with egg release dependent on the age specific contact rate of each individual. Humans are given an age of death when they are born, which is based on some chosen death rates for each age group. We check each time step if anyone has outlived their age of death and if they have, they are then removed from the population. Cercariae from the environment are then uptaken to each surviving individual based on their predisposition and contact rate. These immediately become worms within the human host.","category":"page"},{"location":"","page":"Home","title":"Home","text":"We then perform any interventions which are due to take place at this point in time after which we will cull the miracidia and cercariae in the environment by a chosen percentage. After this we will add births to the population which occur at some specified rate.","category":"page"},{"location":"","page":"Home","title":"Home","text":"A version of this is done by with the following function:","category":"page"},{"location":"","page":"Home","title":"Home","text":"number_years = 200\nnum_time_steps = trunc(Int, 365*number_years / time_step)\nhumans, miracidia, cercariae, record = \nupdate_env_no_births_deaths_human_larvae(num_time_steps, humans,  miracidia, \n                                         cercariae, pars, mda_info, vaccine_info)","category":"page"},{"location":"","page":"Home","title":"Home","text":"There are other versions of this basic approach, where we don't age the population or include births and deaths and also where the population is aged but every death is simply matched with a birth, resulting in the population being kept constant.","category":"page"},{"location":"","page":"Home","title":"Home","text":"To consider interventions such as MDA, we can run the following function:","category":"page"},{"location":"","page":"Home","title":"Home","text":"mda_info = create_mda(0, .75, 0, 1, 10, 1, [0,1], [0,1], [0,1], pars.drug_effectiveness)","category":"page"},{"location":"","page":"Home","title":"Home","text":"The first 3 entries of the create_mda function specify the proportion of individuals in the pre-SAC, SAC and adults. The fourth and fifth entries specifies the time point at which the first and last MDA with take place and the sixth entry specifies how many will take place per year in the intervening time period. The next 3 entries specify the gender to be included in the pre-SAC, SAC and adult MDA programs and the final entry is the efficacy of the drug used.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Pages = [\n    \"man/functions.md\",\n]\nDepth = 1","category":"page"},{"location":"man/functions/#Functions","page":"Functions","title":"Functions","text":"","category":"section"},{"location":"man/functions/","page":"Functions","title":"Functions","text":"Functions included in the Schistoxpkg.","category":"page"},{"location":"man/functions/","page":"Functions","title":"Functions","text":"Modules = [Schistoxpkg]","category":"page"},{"location":"man/functions/#Schistoxpkg.Human","page":"Functions","title":"Schistoxpkg.Human","text":"Human\n\nThis struct contains the information about a human individual. This contains age, the pre determined age of death, community they are in,     their gender, predisposition to picking up cercariae, the number of larvae, female and male worms and eggs in the individual along with     a count of total lifetime eggs. Also it has their age dependent contact rate, adherence and access to interventions.\n\n\n\n\n\n","category":"type"},{"location":"man/functions/#Schistoxpkg.Parameters","page":"Functions","title":"Schistoxpkg.Parameters","text":"Parameters\n\nThis struct containing all of the parameters for a given simulation.\n\n\n\n\n\n","category":"type"},{"location":"man/functions/#Schistoxpkg.mda_information","page":"Functions","title":"Schistoxpkg.mda_information","text":"mda_information\n\nThis struct contains the information for the mda, storing the coverage, minimum and maximum age targeted,     gender, drug efficacy and the time for the mda to be done\n\n\n\n\n\n","category":"type"},{"location":"man/functions/#Schistoxpkg.out","page":"Functions","title":"Schistoxpkg.out","text":"out\n\nThis struct contains the different outputs we are interested in recording. This is the     overall population burden, with categories for low, moderate and heavy burdens, along with     separate categories for the school age children and adults. Along with these, the time of each     result is recorded, so we can subsequently see the prevalence of the otubreak over time.\n\n\n\n\n\n","category":"type"},{"location":"man/functions/#Schistoxpkg.vaccine_information","page":"Functions","title":"Schistoxpkg.vaccine_information","text":"vaccine_information\n\nThis struct contains the information for the vaccine, storing the coverage, minimum and maximum age targeted,     gender, drug efficacy and the time for the vaccine to be done along with how long the vaccine provides protection for\n\n\n\n\n\n","category":"type"},{"location":"man/functions/#Schistoxpkg.administer_drug-Tuple{Any,Any,Any}","page":"Functions","title":"Schistoxpkg.administer_drug","text":"administer_drug(humans, indices, drug_effectiveness)\n\nadminister mda drugs to chosen individuals in the population. If they adhere to the drugs, then they reduce male and female worms with a given efficacy alongside removing eggs\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.administer_vaccine-NTuple{4,Any}","page":"Functions","title":"Schistoxpkg.administer_vaccine","text":"administer_vaccine(humans, indices, vaccine_effectiveness, vaccine_duration)\n\nadminister vaccine to chosen individuals in the population. reduce male and female worms with a given efficacy alongside removing eggs and adding to their vaccine status signifying that they will have increased immunity for a chosen period of time\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.birth_of_human-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.birth_of_human","text":"birth_of_human(humans, pars)\n\nadd an individual to the population\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.calculate_worm_pairs-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.calculate_worm_pairs","text":"calculate_worm_pairs(female_worms, male_worms)\n\ncalculate how many pairs of worms there are in each human host\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.cercariae_death!-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.cercariae_death!","text":"cercariae_death!(miracidia, pars)\n\nKill a chosen proportion of cercariae in the environment governed by the cercariae_survival parameter in the pars struct\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.cercariae_uptake!-NTuple{4,Any}","page":"Functions","title":"Schistoxpkg.cercariae_uptake!","text":"cercariae_uptake(humans, cercariae, miracidia, pars)\n\nuptake cercariae into humans, whilst updating cercariae with miracidia. Uptaken cercariae immediately become worms in this formulation\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.cercariae_uptake_with_human_larvae!-NTuple{4,Any}","page":"Functions","title":"Schistoxpkg.cercariae_uptake_with_human_larvae!","text":"cercariae_uptake_human_larvae!(humans, cercariae, miracidia, pars)\n\nuptake cercariae into humans, whilst updating cercariae with matured miracidia. Uptaken cercariae become larvae within humans, rather than immmediately into worms with this function.\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.collect_prevs-NTuple{9,Any}","page":"Functions","title":"Schistoxpkg.collect_prevs","text":"collect_prevs(times, prev, sac_prev, high_burden, high_burden_sac, adult_prev, high_adult_burden, record, run)\n\ncollect multiple prevalences within the population and store in appropriate arrays\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.count_eggs-Tuple{Any}","page":"Functions","title":"Schistoxpkg.count_eggs","text":"count_eggs(humans)\n\ncount the total number of eggs in the human population\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.create_contact_settings-Tuple{Any}","page":"Functions","title":"Schistoxpkg.create_contact_settings","text":"create_contact_settings(scenario)\n\nThis will create age dependent contact rates based on the scenario for simulation which is input. This is either     \"low adult\", \"moderate adult\" or \"high adult\"\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.create_mda-NTuple{10,Any}","page":"Functions","title":"Schistoxpkg.create_mda","text":"create_mda(pre_SAC_prop, SAC_prop, adult_prop, first_mda_time,\n        last_mda_time, regularity, pre_SAC_gender, SAC_gender, adult_gender, mda_effectiveness)\n\nfunction to create a set of mda's which will be performed regularly         firstmdatime specifies when this will first occur in years,         lastmdatime is the final mda in this block         regularity is how often to perform the mda in years.         specify the proportion of pre SAC, SAC and adults at each of these time points         also specify genders for these differect age groups, along with the effectiveness of mda\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.create_population-Tuple{Any}","page":"Functions","title":"Schistoxpkg.create_population","text":"create_population(pars)\n\nThis will create the initial human population with randomly chosen age, and gender. Predisposition is taken to be gamma distributed There is also a male and female adjustment to predisposition adjusting for gender specific behaviour In addition to this, it will create the initial miracidia environment vector\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.create_population_specified_ages-Tuple{Any}","page":"Functions","title":"Schistoxpkg.create_population_specified_ages","text":"create_population_specified_ages(pars)\n\nThis will create the initial human population with an age distribution specified by the spec_ages variable Predisposition is taken to be gamma distributed. There is also a male and female adjustment to predisposition adjusting for gender specific behaviour In addition to this, it will create the initial miracidia environment vector\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.death_of_human-Tuple{Any}","page":"Functions","title":"Schistoxpkg.death_of_human","text":"death_of_human(humans)\n\nremove individuals from the population whose age is greater than their death age\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.egg_production!-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.egg_production!","text":"egg_production!(humans, pars)\n\nfunction to produce eggs for individuals, dependent on how many worms they have         and the max fecundity and density dependent fecundity of the population\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.egg_production_increasing!-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.egg_production_increasing!","text":"egg_production_increasing!(humans, pars)\n\nfunction to produce eggs for individuals, dependent on how many worms they have         and the max fecundity and density dependent fecundity of the population\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.generate_age_distribution-Tuple{Any}","page":"Functions","title":"Schistoxpkg.generate_age_distribution","text":"generate_age_distribution(pars)\n\ngenerate population numbers for each age in\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.generate_ages_and_deaths-Tuple{Any,Any,Any}","page":"Functions","title":"Schistoxpkg.generate_ages_and_deaths","text":"generate_ages_and_deaths(num_steps, humans, pars)\n\nStep forward the population by a number of steps, where we will go through aging and removing individuals when they pass their age of death. This will generate an age distribution in the population which corresponds to the deathprobbyage and agesfor_deaths parameters, which specify the probability of dying at each age.\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.get_death_age-Tuple{Any}","page":"Functions","title":"Schistoxpkg.get_death_age","text":"create_population(pars)\n\nThis will create the initial human population with randomly chosen age, and gender. Predisposition is taken to be gamma distributed There is also a male and female adjustment to predisposition adjusting for gender specific behaviour In addition to this, it will create the initial miracidia environment vector\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.get_prevalences!-Tuple{Any,Any,Any}","page":"Functions","title":"Schistoxpkg.get_prevalences!","text":"get_prevalences!(humans, time, pars)\n\ncalculate the desired prevalences in the human population, and store them in an out struct\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.human_larvae_maturity-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.human_larvae_maturity","text":"human_larvae_maturity(humans, pars)\n\nThis will mature the human larvae into worms after a chosen number of days, which is specified by the humanlarvaematurity_time parameter in the pars struct\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.kato_katz-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.kato_katz","text":"kato_katz(eggs, gamma_k)\n\ncalculate number of eggs using kato katz method. Gammak is a gamma distribution with shape and scale defined by pars.katokatz_par\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.load_population_from_file-Tuple{Any}","page":"Functions","title":"Schistoxpkg.load_population_from_file","text":"load_population_from_file(filename)\n\nload the environmental variables saved in the specified file\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.make_age_contact_rate_array-NTuple{4,Any}","page":"Functions","title":"Schistoxpkg.make_age_contact_rate_array","text":"make_age_contact_rate_array(pars, scenario, input_ages, input_contact_rates)\n\nThis will make the contact rate array for each age of individual in the population, based either on a scenario basis     (\"low adult\", \"moderate adult\" or \"high adult\"), through the createcontactsettings function, or through     specifying an array of age breaks and the desired contact rates for the ages specified by the ages, using the         inputages and inputcontactrates variables.     For example: inputcontactrates = [0.02,0.61, 1,0.06], inputages= [4,9,15,100] will make 0-4 year olds have contact rate 0.02,     5-9 will have rate 0.61, 10-15 rate 1 and 16+ 0.06\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.mda-NTuple{6,Any}","page":"Functions","title":"Schistoxpkg.mda","text":"mda(humans, mda_coverage, min_age_mda, max_age_mda, mda_effectiveness, mda_gender)\n\nadminister mda in the population. This includes choosing individuals between specified ages, having a certain level of coverage and taking access and adherence into consideration\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.miracidia_death!-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.miracidia_death!","text":"miracidia_death!(miracidia, pars)\n\nKill a chosen proportion of miracidia in the environment governed by the miracidia_survival parameter in the pars struct\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.miracidia_production!-Tuple{Any}","page":"Functions","title":"Schistoxpkg.miracidia_production!","text":"miracidia_production!(humans)\n\nrelease eggs from individuals into the environment as miracidia. Release is relative to the contact rate with the environment for each individual.\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.run_repeated_sims_no_births_deaths-NTuple{5,Any}","page":"Functions","title":"Schistoxpkg.run_repeated_sims_no_births_deaths","text":"run_repeated_sims_no_births_deaths(filename, num_time_steps, mda_info, vaccine_info, num_repeats)\n\nrun multiple simulations where aging of the population is not included and larvae are uptaken by humans as worms\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.run_repeated_sims_no_births_deaths_human_larvae-NTuple{5,Any}","page":"Functions","title":"Schistoxpkg.run_repeated_sims_no_births_deaths_human_larvae","text":"run_repeated_sims_no_births_deaths_human_larvae(filename, num_time_steps, mda_info, vaccine_info, num_repeats)\n\nrun multiple simulations where aging of the population is not included and larvae are uptaken by humans as larvae\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.run_repeated_sims_no_births_deaths_increasing-NTuple{5,Any}","page":"Functions","title":"Schistoxpkg.run_repeated_sims_no_births_deaths_increasing","text":"run_repeated_sims_no_births_deaths_human_larvae(filename, num_time_steps, mda_info, vaccine_info, num_repeats)\n\nrun multiple simulations where aging of the population is not included and larvae are uptaken by humans as worms, and egg production is monotonically increasing\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.run_repeated_sims_no_population_change-NTuple{5,Any}","page":"Functions","title":"Schistoxpkg.run_repeated_sims_no_population_change","text":"run_repeated_sims_no_population_change(filename, num_time_steps, mda_info, vaccine_info, num_repeats)\n\nrun multiple simulations where aging of the population is aged, but each death is replaced by a birth and larvae are uptaken by humans as worms`\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.run_repeated_sims_no_population_change_human_larvae-NTuple{5,Any}","page":"Functions","title":"Schistoxpkg.run_repeated_sims_no_population_change_human_larvae","text":"run_repeated_sims_no_population_change_human_larvae(filename, num_time_steps, mda_info, vaccine_info, num_repeats)\n\nrun multiple simulations where the population is aged, but each death is replaced by a birth and larvae are uptaken by humans as larvae\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.run_repeated_sims_no_population_change_increasing-NTuple{5,Any}","page":"Functions","title":"Schistoxpkg.run_repeated_sims_no_population_change_increasing","text":"run_repeated_sims_no_population_change(filename, num_time_steps, mda_info, vaccine_info, num_repeats)\n\nrun multiple simulations where aging of the population is not included, larvae are uptaken by humans as worms\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.save_population_to_file-NTuple{5,Any}","page":"Functions","title":"Schistoxpkg.save_population_to_file","text":"save_population_to_file(filename, humans, miracidia, cercariae, pars)\n\nsave the enironment variables in a specified file\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.specified_age_distribution-Tuple{Any}","page":"Functions","title":"Schistoxpkg.specified_age_distribution","text":"specified_age_distribution(pars)\n\noutput ages according to a specified age distribution\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.update_contact_rate-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.update_contact_rate","text":"update_contact_rate(humans, pars)\n\nfunction to update the contact rate of individuals in the population. This is necessary     as over time when people age, they will move through different age groups which have     different contact rates\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.update_env_constant_population-NTuple{7,Any}","page":"Functions","title":"Schistoxpkg.update_env_constant_population","text":"update_env_constant_population(num_time_steps, humans,  miracidia, cercariae, pars, mda_info, vaccine_info)\n\nupdate the population for a given length of time. Here we include deaths and for each death an individual is immediately born.     Interventions are included in this function and larvae are immediately uptaken as worms\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.update_env_constant_population_human_larvae-NTuple{7,Any}","page":"Functions","title":"Schistoxpkg.update_env_constant_population_human_larvae","text":"update_env_constant_population_human_larvae(num_time_steps, humans,  miracidia, cercariae, pars, mda_info, vaccine_info)\n\nupdate the population for a given length of time. Here we include deaths and for each death an individual is immediately born. Interventions are included in this function and larvae are uptaken as larvae in the humans.\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.update_env_constant_population_increasing-NTuple{7,Any}","page":"Functions","title":"Schistoxpkg.update_env_constant_population_increasing","text":"update_env_constant_population_increasing(num_time_steps, humans,  miracidia, cercariae, pars, mda_info, vaccine_info)\n\nupdate the population for a given length of time. Here we include deaths and for each death an individual is immediately born. Interventions are included in this function and larvae are uptaken immediately as worms and egg production follows a monotonically increasing function\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.update_env_no_births_deaths-NTuple{7,Any}","page":"Functions","title":"Schistoxpkg.update_env_no_births_deaths","text":"update_env_no_births_deaths(num_time_steps, humans,  miracidia, cercariae, pars, mda_info, vaccine_info)\n\nupdate the population for a given length of time. Here we do not include births or deaths and individuals do not age Interventions are included in this function and larvae are uptaken immediately as worms\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.update_env_no_births_deaths_human_larvae-NTuple{7,Any}","page":"Functions","title":"Schistoxpkg.update_env_no_births_deaths_human_larvae","text":"update_env_no_births_deaths_human_larvae(num_time_steps, humans,  miracidia, cercariae, pars, mda_info, vaccine_info)\n\nupdate the population for a given length of time. Here we do not include births or deaths and individuals do not age Interventions are included in this function and larvae are uptaken as larvae in humans\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.update_env_no_births_deaths_increasing-NTuple{7,Any}","page":"Functions","title":"Schistoxpkg.update_env_no_births_deaths_increasing","text":"update_env_no_births_deaths_increasing(num_time_steps, humans,  miracidia, cercariae, pars, mda_info, vaccine_info)\n\nupdate the population for a given length of time. Here we do not include births or deaths and individuals do not age Interventions are included in this function and larvae are uptaken as immediately as worms and egg production is monotonically increasing\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.update_env_to_equilibrium-NTuple{5,Any}","page":"Functions","title":"Schistoxpkg.update_env_to_equilibrium","text":"update_env_to_equilibrium(num_time_steps, humans, miracidia, cercariae, pars)\n\nupdate the population for a given length of time. Here we do not age the population or include birth, deaths or interventions.\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.update_env_to_equilibrium_human_larvae-NTuple{5,Any}","page":"Functions","title":"Schistoxpkg.update_env_to_equilibrium_human_larvae","text":"update_env_to_equilibrium_human_larvae(num_time_steps, humans, miracidia, cercariae, pars)\n\nupdate the population for a given length of time. Here we do not age the population or include birth, deaths or interventions and for this function larvae are uptaken from the environment into a larvae category in the humans, rather than immediately becoming worms\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.update_env_to_equilibrium_increasing-NTuple{5,Any}","page":"Functions","title":"Schistoxpkg.update_env_to_equilibrium_increasing","text":"update_env_to_equilibrium_increasing(num_time_steps, humans, miracidia, cercariae, pars)\n\nupdate the population for a given length of time. Here we do not age the population or include birth, deaths or interventions and for this function larvae are uptaken from the environment immediately to worms and eggs are produced using a monotonically increasing function\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.update_mda-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.update_mda","text":"update_mda(mda_info, mda_round)\n\nupdate when the next mda will take place\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.vac_decay!-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.vac_decay!","text":"vac_decay!(humans, pars)\n\ndecrease vaccination status for each person by 1 each day\n\n\n\n\n\n","category":"method"},{"location":"man/functions/#Schistoxpkg.worm_maturity!-Tuple{Any,Any}","page":"Functions","title":"Schistoxpkg.worm_maturity!","text":"worm_maturity!(humans, pars)\n\nfunction to kill worms within human hosts, and if there is more than one stage for worm life, to update how many worms are in each stage\n\n\n\n\n\n","category":"method"}]
}