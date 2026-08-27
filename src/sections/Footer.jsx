function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 text-2xl font-bold text-primary md:mb-0">
            {'<Dev/>'}
          </div>
          <div className="text-muted-foreground">
            {'\u00A9'} {year} Jyothsna Vellampalli. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
