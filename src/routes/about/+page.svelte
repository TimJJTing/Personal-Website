<script>
	let { data } = $props();
	let meta = $derived(data.meta);

	/**
	 * @param {string} dateStr
	 */
	function formatDate(dateStr) {
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
	}

	/**
	 * @param {string} startTime
	 * @param {string | null | undefined} endTime
	 */
	function formatDateRange(startTime, endTime) {
		const start = formatDate(startTime);
		const end = endTime ? formatDate(endTime) : 'Present';
		return `${start} — ${end}`;
	}

	/**
	 * @param {string} startTime
	 * @param {string | null | undefined} endTime
	 */
	function formatYearRange(startTime, endTime) {
		const startYear = new Date(startTime).getFullYear();
		const endYear = endTime ? new Date(endTime).getFullYear() : undefined;
		if (endYear && endYear !== startYear) {
			return `${startYear} — ${endYear}`;
		}
		return `${startYear}`;
	}

	/**
	 * @template {Record<string, any> & {publish: boolean}} T
	 * @param {T[]} items
	 * @returns {T[]}
	 */
	function published(items) {
		return items.filter((item) => item.publish);
	}
</script>

<main class="py-8 md:py-12">
	<!-- Header -->
	<header class="mb-10 md:mb-14">
		<h1 class="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
			{meta.title}
		</h1>
		{#if meta.summary}
			<p class="mt-4 text-lg md:text-xl leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-3xl">
				{meta.summary}
			</p>
		{/if}
		{#if meta.links?.length}
			<nav class="mt-5 flex flex-wrap gap-3">
				{#each meta.links as link}
					<a
						href={link.url}
						class="inline-flex items-center text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
					>
						{link.title} ↗
					</a>
				{/each}
			</nav>
		{/if}
	</header>

	<!-- Experience -->
	{#if meta.experience?.publish && meta.experience.content?.length}
		<section class="mb-10 md:mb-14">
			<h2 class="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
				Experience
			</h2>
			<div class="space-y-8">
				{#each published(meta.experience.content) as job}
					<div class="group grid grid-cols-1 md:grid-cols-[1fr_200px] gap-1 md:gap-8">
						<div>
							<h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
								{job.title}
							</h3>
							<p class="text-base text-neutral-600 dark:text-neutral-400 mt-0.5">
								{job.company}
							</p>
							{#if job.works?.length}
								<ul class="mt-3 space-y-2">
									{#each job.works as work}
										<li class="text-base leading-relaxed text-neutral-700 dark:text-neutral-300 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-neutral-300 dark:before:bg-neutral-600">
											{work}
										</li>
									{/each}
								</ul>
							{/if}
							{#if job.projectGroups?.length}
								{#each job.projectGroups as group}
									<h4 class="mt-4 text-base font-semibold text-neutral-800 dark:text-neutral-200">
										{group.name}
									</h4>
									{#if group.works?.length}
										<ul class="mt-2 space-y-2">
											{#each group.works as work}
												<li class="text-base leading-relaxed text-neutral-700 dark:text-neutral-300 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-neutral-300 dark:before:bg-neutral-600">
													{work}
												</li>
											{/each}
										</ul>
									{/if}
								{/each}
							{/if}
						</div>
						<div class="text-sm text-neutral-500 dark:text-neutral-400 md:pt-0.5 md:text-right order-first md:order-last">
							<div>{formatDateRange(job.startTime, job.endTime)}</div>
							<div class="text-neutral-400 dark:text-neutral-500">{job.location}</div>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Education -->
	{#if meta.education?.publish && meta.education.content?.length}
		<section class="mb-10 md:mb-14">
			<h2 class="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
				Education
			</h2>
			<div class="space-y-6">
				{#each published(meta.education.content) as edu}
					<div class="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-1 md:gap-8">
						<div>
							<h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
								{edu.title}
							</h3>
							<p class="text-base text-neutral-600 dark:text-neutral-400 mt-0.5">
								{edu.institute} · {edu.location}
							</p>
							{#if edu.works?.length}
								<ul class="mt-2 space-y-1">
									{#each edu.works as work}
										<li class="text-sm text-neutral-500 dark:text-neutral-400 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-neutral-300 dark:before:bg-neutral-600">
											{work}
										</li>
									{/each}
								</ul>
							{/if}
						</div>
						<div class="text-sm text-neutral-500 dark:text-neutral-400 md:text-right order-first md:order-last">
							{formatYearRange(edu.startTime, edu.endTime)}
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Skills -->
	{#if meta.skills?.publish && meta.skills.content?.length}
		<section class="mb-10 md:mb-14">
			<h2 class="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
				Skills
			</h2>
			<div class="space-y-4">
				{#each published(meta.skills.content) as skill}
					<div>
						<h3 class="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
							{skill.title}
						</h3>
						{#if skill.description}
							<div class="flex flex-wrap gap-2">
								{#each skill.description.split(', ') as tag}
									<span class="inline-block px-2.5 py-1 text-sm rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
										{tag}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Interests -->
	{#if meta.interests?.publish && meta.interests.content?.length}
		<section class="mb-10 md:mb-14">
			<h2 class="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
				Interests
			</h2>
			<div class="flex flex-wrap gap-2">
				{#each published(meta.interests.content) as interest}
					<span class="inline-block px-2.5 py-1 text-sm rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
						{interest.title}
					</span>
				{/each}
			</div>
		</section>
	{/if}
</main>
